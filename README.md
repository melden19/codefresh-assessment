#Container logger
##Run demo

### Requirements
1. node
2. yarn
3. docker
4. docker-compose

### Steps to run demo
1. Be sure that port 3000 and 8080 is not used
1. Go to project root
2. Run `yarn start:prod`
3. After UI become available go to the `Pipeline` tab and run pipeline with desired storage layer. (Each step (container) will be terminated after 10 seconds of execution - default timeout, can be changed within docker-compose.yml).
4. When pipeline finish executing get the exposed id of running container and use it to retrieve logs on `Logs` tab choosing the desired storage layer.


Step can be described with 2 fields: image and cmd.

## Annotation

Source code of the tool can be found in path `...codefresh-assesment/packages/server/src`.
`engine` is a part of software responsible for running pipelines, attaching and logging steps.
`storageLayers` is a implementation of storage layer interface. There are 2 predefined storages: `mongo` and `fs`.
`fs` store logs in path `/home/${USER}/fs-logs-storage`,  `mongo` in `docker-logger` db. Both are using abstract interface `StorageLayer`.