class ContainerLogger {
    constructor(id, storage) {
        this.id = id;
        this.storage = storage;

        this.errorMessage = `Failed to run ${this.constructor.name}`;
    }

    initStorageLayer() {
        return this.storage.init(this.container.id);
    }

    async run() {
        try {
            await this.initStorageLayer();
            await this.exec();
        } catch(err) {
            console.error(this.errorMessage, err);
        }
    }

    async exec() {}
}

module.exports = ContainerLogger;
