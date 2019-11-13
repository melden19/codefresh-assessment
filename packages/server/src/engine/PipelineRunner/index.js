const { readFileSync } = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const { docker, storageLayer } = require('../../../config');
const startListener = require('../StartListener');
const createStorageLayer = require('../../storageLayers');
const { logContainer, normalizeId } = require('../../helpers');
const Logger = require('../ContainerLogger');

class PipelineRunner {
    constructor(settings = {}) {
        const { path } = settings;
        this.path = path || './pipeline.yml';
    }

    async run() {
        try {
            const pipeline = this._loadPipeline();
            this._validatePipeline(pipeline);

            await this._initListener();

            for (const [key, value] of Object.entries(pipeline.steps)) {
                const { StatusCode } = await this._runStep({ name: key, ...value });
                if (StatusCode > 0) {
                    throw new Error(`Pipeline failed on step ${key} with status code ${StatusCode}`);
                }
            }
            console.log('Pipeline run successfully');
            this._killListener();

        } catch (err) {
            console.error('Failed to run pipeline cause of: ', err);
            this._killListener();
        }
    }

    async _runStep(step) {
        const { image: Image, commands: Cmd, name } = step;

        try {
            const container = await docker.createContainer({ name, Image, Cmd, AttachStdout: true, AttachStderr: true });
            const output = await container.start();
            if (output.Error) {
                throw output.Error;
            }
            const res = await container.wait();
            return res;
        } catch (err) {
            throw new Error(`Failed to run step cause of: ${err}`);
        }
    }

    _loadPipeline() {
        try {
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
        return startListener.start(async (container) => {
            normalizeId(container);

            const storage = createStorageLayer(storageLayer, 'writer', container);

            const logger = new Logger(container.id, storage);
            await logger.run();
        });
    }

    _killListener() {
        startListener.stop();
    }
}

module.exports = PipelineRunner;
