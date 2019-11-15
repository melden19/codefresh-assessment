const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const _ = require('lodash');
const yaml = require('js-yaml');
const uuid = require('uuid/v4');
const { docker, containerTimeout } = require('../../config');
const startListener = require('./startListener');
const createStorageLayer = require('../storageLayers');
const { normalizeId, logContainer } = require('../helpers');
const Logger = require('./ContainerLogger');

const STATIC_STEP_LABEL = 'codefresh-assessment-pipeline-step';

class PipelineRunner {
    constructor(settings = {}) {
        const { path, pipeline, storageLayer }  = settings;
        this.path = path || './pipeline.yml';
        this.pipeline = pipeline;
        this.storageLayer = storageLayer;

        //  to prevent step name conflicts
        this.pipelineSalt = uuid();
        //  label for startListener to listen for
        this.stepLabel = `${STATIC_STEP_LABEL}-${this.pipelineSalt}`;
    }

    async run() {
        const executionResult = [];

        try {
            const pipeline = this._loadPipeline();
            this._validatePipeline(pipeline);

            await this._initListener();

            for (const [stepName, stepMeta] of Object.entries(pipeline.steps)) {

                const container = await this._runStep({ name: stepName, ...stepMeta });
                normalizeId(container);
                executionResult.push({ name: stepName, ...container });

                if (container.exitCode > 0) {
                    if (container.exitCode === 143) {
                        throw new Error(`Step ${stepName} was terminated cause of predefined max execution timeout: ${containerTimeout / 1000} sec`);
                    }
                    throw new Error(`Pipeline failed on step ${stepName} with status code ${container.statusCode}`);
                }
            }
            console.log('Pipeline run successfully');
            this._gracefulShutdown();
            return { executionResult, status: 'Pipeline run successfully' };

        } catch (err) {
            console.error('Failed to run pipeline cause of: ', err);
            this._gracefulShutdown();
            return { executionResult, status: `Failed to run pipeline cause of: ${err}`, error: true };
        }
    }

    async _runStep(step) {
        const { image: Image, cmd: Cmd, name } = step;

        try {
            const container = await docker.createContainer({
                name: `${this.pipelineSalt}-${name}`,
                Image,
                Cmd,
                Labels: {
                    meta: this.stepLabel
                }
            });
            const output = await container.start();
            let running = true;

            if (output.Error) {
                throw output.Error;
            }

            setTimeout(() => {
                if (running) {
                    container.stop().catch((err) => {
                        console.error('Container timeout termination failed', err);
                    });
                }
            }, containerTimeout);

            const res = await container.wait();
            running = false;

            return {
                exitCode: res.StatusCode,
                id: container.id
            };
        } catch (err) {
            throw new Error(`Failed to run step cause of: ${err}`);
        }
    }

    _loadPipeline() {
        try {
            if (this.pipeline) {
                return this.pipeline;
            }
            const file = readFileSync(this.path);
            return yaml.safeLoad(file);
        } catch (err) {
            throw new Error(`Failed to load pipeline cause of: ${err}`);
        }
    }

    _validatePipeline({ steps }) {
        if (!_.keys(steps)) {
            throw new Error('Validation failed');
        }
    }

    _initListener() {
        return startListener.start({ labels: [`meta=${this.stepLabel}`] }, async (container) => {
            normalizeId(container);
            logContainer('Attaching to container', container);

            const storage = createStorageLayer(this.storageLayer, 'writer', container);

            const logger = new Logger(container.id, storage);
            await logger.run();
        });
    }

    _gracefulShutdown() {
        execSync('yes | docker container prune');
        startListener.stop();
    }
}

module.exports = PipelineRunner;
