import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import  Docker from 'dockerode/lib/docker'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import DockerService, { Service } from '../src/docker-base-service'
import DockerSwarmService, { Service as SwarmService } from '../src/docker-swarm-service'
import DockerNetworkService, { Service as NetworkService } from '../src/docker-network-service'
import DockerContainerService, { Service as ContainerService } from '../src/docker-container-service'
import DockerImageService, { Service as ImageService } from '../src/docker-image-service'
import DockerVolumeService, { Service as VolumeService } from '../src/docker-volume-service'

const debug = require('debug')('feathers-docker-manager:test')

describe('feathers-docker-manager', () => {
	let testSwarm, testConfig, testContainer
	const client = Docker()
	const serviceOptions = {
		connectionId: uuid(),
		client: client,
		events: ['testing']
	}
	const serviceOptionsConnectionId = {
		client: serviceOptions.connectionId,
		events: ['testing']
	}
	const app = feathers()
	describe('Base Service', () => {
		const rawService = new Service(serviceOptions)
		rawService.setup(app, '/docker-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'docker' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('docker')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' docker service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the docker server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal('OK')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the docker info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.have.property('Containers')
					})
				})
			})
			describe('close', () => {
				it(`closes the docker client connection`, () => {
					return rawService.close().then((results: any) => {
						expect(results).to.equal('nan')
					})
				})
			})
		})
		//app.use('d-service', DockerService(serviceOptions))
		//const dService = app.service('d-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'd-service', 'id')
		//})
	})
	describe('Swarm Service', () => {
		const rawSwarmService = new SwarmService(serviceOptions)
		rawSwarmService.setup(app, '/swarm-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				expect(rawSwarmService.getConnectionType()).to.equal('docker')
			})
			describe('getServiceType', () => {
				it(`returns the 'swarm-service' docker service type`, () => {
					expect(rawSwarmService.getServiceType()).to.equal('swarm-service')
				})
			})
		})
		describe('Swarm Specific Methods', () => {
			describe('createSwarm', () => {
				it(`creates a docker swarm and returns`, () => {
					return rawSwarmService.createSwarm({
						ListenAddr: "0.0.0.0:4500",
						ForceNewCluster: false,
						Spec: {
							AcceptancePolicy: {
								Policies: [{
									Role: "MANAGER",
									Autoaccept: false
								}, {
									Role: "WORKER",
									Autoaccept: true
								}]
							},
							Orchestration: {},
							Raft: {},
							Dispatcher: {},
							CAConfig: {}
						}
					})
					.then((result: any) => {
						expect(result).to.be.a('string')
					}).catch((error: any) => {
						console.log(`docker create swarm test error: ${error.message}`)
					})
				})
			})
			describe('joinSwarm', () => {
				it (`joins an existing docker swarm`, () => {
					return rawSwarmService.joinSwarm({})
					.then((result: any) => {
						expect(result).to.have.property('Name')
					}).catch((error: any) => {
						console.log(`docker join swarm test error: ${error.message}`)
					})
				})
			})
			describe('updateSwarm', () => {
				it (`updates an existing docker swarm`, () => {
					return rawSwarmService.updateSwarm({})
					.then((result: any) => {
						expect(result).to.have.property('Name')
					}).catch((error: any) => {
						console.log(`docker update swarm test error: ${error.message}`)
					})
				})
			})
			describe('leaveSwarm', () => {
				it (`leaves a docker swarm`, () => {
					return rawSwarmService.leaveSwarm({
						force: true
					})
					.then((result: any) => {
						expect(result).to.equal('')
					}).catch((error: any) => {
						console.log(`docker leave swarm test error: ${error.message}`)
					})
				})
			})
		})
		//app.use('sw-service', DockerSwarmService(serviceOptions))
		//const swarmService = app.service('sw-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'sw-service', 'id')
		//})
	})
	describe('Network Service', () => {
		const rawNetworkService = new NetworkService(serviceOptions)
		rawNetworkService.setup(app, '/network-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'network-service' docker service type`, () => {
					expect(rawNetworkService.getServiceType()).to.equal('network-service')
				})
			})
		})
		describe('Network Specific Methods', () => {
			describe('createNetwork', () => {
				it(`creates a docker network and returns the network id`, () => {
					return rawNetworkService.createNetwork({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker create network test error: ${error.message}`)
					})
				})
			})
			describe('getNetwork', () => {
				it(`returns a docker network`, () => {
					return rawNetworkService.getNetwork('')
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker get network test error: ${error.message}`)
					})
				})
			})
			describe('listNetworks', () => {
				it(`returns a list of docker networks`, () => {
					return rawNetworkService.listNetworks({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker list networks test error: ${error.message}`)
					})
				})
			})
			describe('pruneNetworks', () => {
				it(`prunes networks and returns list of networks pruned`, () => {
					return rawNetworkService.pruneNetworks({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker prune networks test error: ${error.message}`)
					})
				})
			})
			describe('executeAction', () => {
				it(`executes remove network command`, () => {
					return rawNetworkService.executeAction('Id', 'remove', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute remove network action test error: ${error.message}`)
					})
				})
				it(`executes connect network command`, () => {
					return rawNetworkService.executeAction('Id', 'connect', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute connect network action test error: ${error.message}`)
					})
				})
				it(`executes disconnect network command`, () => {
					return rawNetworkService.executeAction('Id', 'disconnect', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute disconnect network action test error: ${error.message}`)
					})
				})
				it(`executes inspect network command`, () => {
					return rawNetworkService.executeAction('Id', 'inspect', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute inspect network action test error: ${error.message}`)
					})
				})
			})
		})
		//app.use('n-service', DockerNetworkService(serviceOptions))
		//const netService = app.service('n-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'n-service', 'id')
		//})
	})
	describe('Container Service', () => {
		const rawContainerService = new ContainerService(serviceOptions)
		rawContainerService.setup(app, '/container-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'container-service' docker service type`, () => {
					expect(rawContainerService.getServiceType()).to.equal('container-service')
				})
			})
		})
		describe('Container Specific Methods', () => {
			describe('createContainer', () => {
				it(`creates a docker container and returns result`, () => {
					return rawContainerService.createContainer({
						Image: 'ubuntu',
						AttachStdin: false,
						AttachStdout: true,
						AttachStderr: true,
						Tty: true,
						Cmd: ['/bin/bash', '-c', 'tail -f /etc/resolv.conf'],
						OpenStdin: false,
						StdinOnce: false
					})
					.then((container: any) => {
						testContainer = container.id
						expect(container).to.have.property('id')
					}).catch((error: any) => {
						console.log(`docker create container test error: ${error.message}`)
					})
				})
			})
			describe('getContainer', () => {
				it(`gets a docker container by Id`, () => {
					return rawContainerService.createContainer({
						Image: 'ubuntu',
						AttachStdin: false,
						AttachStdout: true,
						AttachStderr: true,
						Tty: true,
						Cmd: ['/bin/bash', '-c', 'tail -f /etc/resolv.conf'],
						OpenStdin: false,
						StdinOnce: false
					})
					.then((container: any) => {
						testContainer = container.id
						return rawContainerService.getContainer(container.id)
						.then((result: any) => {
							expect(result.id).to.equal(testContainer)
						})
					}).catch((error: any) => {
						console.log(`docker get container test error: ${error.message}`)
					})
				})
			})
			describe('listContainers', () => {
				it(`returns a list of docker containers`, () => {
					return rawContainerService.listContainers({})
					.then((results: any) => {
						expect(results.length).to.equal(0)
					}).catch((error: any) => {
						console.log(`docker list containers test error: ${error.message}`)
					})
				})
			})
			describe('pruneContainers', () => {
				it(`prunes docker containers`, () => {
					return rawContainerService.pruneContainers({})
					.then((results: any) => {
						expect(results).to.have.property('ContainersDeleted')
					}).catch((error: any) => {
						console.log(`docker prune container test error: ${error.message}`)
					})
				})
			})
			describe('executeAction', () => {
				it(`executes inpect container command`, () => {
					return rawContainerService.executeAction('Id', 'inspect', {})
					.then((results: any) => {

					}).catch((error: any) => {
						console.log(`docker execute inspect container action test error: ${error.message}`)
					})
				})
				it(`executes rename container command`, () => {
					return rawContainerService.executeAction('Id', 'rename', {})
					.then((results: any) => {

					}).catch((error: any) => {
						console.log(`docker execute rename container action test error: ${error.message}`)
					})
				})
				it(`executes update container command`, () => {
					return rawContainerService.executeAction('Id', 'update', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute update container action test error: ${error.message}`)
					})
				})
				it (`executes top container command`, () => {
					return rawContainerService.executeAction('Id', 'top', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute top container action test error: ${error.message}`)
					})
				})
				it (`executes check container changes command`, () => {
					return rawContainerService.executeAction('Id', 'changes', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute check changes container action test error: ${error.message}`)
					})
				})
				it (`executes export container command`, () => {
					return rawContainerService.executeAction('Id', 'export', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute export container action test error: ${error.message}`)
					})
				})
				it (`executes start container command`, () => {
					return rawContainerService.executeAction('Id', 'start', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute start container action test error: ${error.message}`)
					})
				})
				it (`executes stop container command`, () => {
					return rawContainerService.executeAction('Id', 'stop', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute stop container action test error: ${error.message}`)
					})
				})
				it (`executes pause container command`, () => {
					return rawContainerService.executeAction('Id', 'pause', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute pause container action test error: ${error.message}`)
					})
				})
				it (`executes unpause container command`, () => {
					return rawContainerService.executeAction('Id', 'unpause', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute unpause container action test error: ${error.message}`)
					})
				})
				it (`executes commit container command`, () => {
					return rawContainerService.executeAction('Id', 'commit', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute commit container action test error: ${error.message}`)
					})
				})
				it (`executes restart container command`, () => {
					return rawContainerService.executeAction('Id', 'restart', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute restart container action test error: ${error.message}`)
					})
				})
				it (`executes kill container command`, () => {
					return rawContainerService.executeAction('Id', 'kill', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute kill container action test error: ${error.message}`)
					})
				})
				it (`executes resize container command`, () => {
					return rawContainerService.executeAction('Id', 'resize', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute resize container action test error: ${error.message}`)	
					})
				})
				it (`executes attach container command`, () => {
					return rawContainerService.executeAction('Id', 'attach', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute attach container action test error: ${error.message}`)
					})
				})
				it (`executes wait container command`, () => {
					return rawContainerService.executeAction('Id', 'wait', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute wait container action test error: ${error.message}`)
					})
				})
				it (`executes remove container command`, () => {
					return rawContainerService.executeAction('Id', 'remove', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute remove container action test error: ${error.message}`)
					})
				})
				it (`executes get archive container command`, () => {
					return rawContainerService.executeAction('Id', 'get-archive', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute get archive container action test error: ${error.message}`)
					})
				})
				it (`executes info archive container command`, () => {
					return rawContainerService.executeAction('Id', 'info-archive', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute info archive container action test error: ${error.message}`)
					})
				})
				it (`executes put archive container command`, () => {
					return rawContainerService.executeAction('Id', 'put-archive', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute put archive container action test error: ${error.message}`)
					})
				})
				it (`executes container log command`, () => {
					return rawContainerService.executeAction('Id', 'logs', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute logs container action test error: ${error.message}`)
					})
				})
				it (`executes container stats command`, () => {
					return rawContainerService.executeAction('Id', 'stats', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute stats container action test error: ${error.message}`)
					})
				})
			})
		})
		//app.use('conn-service', DockerContainerService(serviceOptions))
		//const conService = app.service('con-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'conn-service', 'id')
		//})
	})
	describe('Image Service', () => {
		const rawImageService = new ImageService(serviceOptions)
		rawImageService.setup(app, '/image-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'image-service' docker service type`, () => {
					expect(rawImageService.getServiceType()).to.equal('image-service')
				})
			})
		})
		describe('Image Specific Methods', () => {
			describe('createImage', () => {
				return rawImageService.createImage({}, {})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker create image test error: ${error.message}`)
				})
			})
			describe('loadImage', () => {
				return rawImageService.loadImage({}, {})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker load image test error: ${error.message}`)
				})
			})
			describe('importImage', () => {
				return rawImageService.importImage({}, {})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker import image test error: ${error.message}`)
				})
			})
			describe('buildImage', () => {
				return rawImageService.buildImage({}, {})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker build image test error: ${error.message}`)
				})
			})
			describe('getImage', () => {
				return rawImageService.getImage({})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker get image test error: ${error.message}`)
				})
			})
			describe('listImages', () => {
				return rawImageService.listImages({})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker list images test error: ${error.message}`)
				})
			})
			describe('pruneImages', () => {
				return rawImageService.pruneImages({})
				.then((results: any) => {
					expect(results).to.not.be.null
				})
				.catch((error: any) => {
					console.log(`docker prune images test error: ${error.message}`)
				})
			})
			describe('executeAction', () => {
				it (`executes get image command`, () => {
					return rawImageService.executeAction('Id', 'get', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute get image action test error: ${error.message}`)
					})
				})
				it (`executes history image command`, () => {
					return rawImageService.executeAction('Id', 'history', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute get history image action test error: ${error.message}`)
					})
				})
				it (`executes push image command`, () => {
					return rawImageService.executeAction('Id', 'push', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute push image action test error: ${error.message}`)
					})
				})
				it (`executes tag image command`, () => {
					return rawImageService.executeAction('Id', 'tag', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute tag image action test error: ${error.message}`)
					})
				})
				it (`executes remove command`, () => {
					return rawImageService.executeAction('Id', 'remove', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					}).catch((error: any) => {
						console.log(`docker execute remove image action test error: ${error.message}`)
					})
				})
			})
		})
		//app.use('i-service', DockerImageService(serviceOptions))
		//const iService = app.service('i-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'i-service', 'id')
		//})
	})
	describe('Volume Service', () => {
		const rawVolumeService = new VolumeService(serviceOptions)
		rawVolumeService.setup(app, '/network-service')
		describe('Connection Methods', () => {
			describe('getServiceType', () => {
				it(`returns the 'volume-service' docker service type`, () => {
					expect(rawVolumeService.getServiceType()).to.equal('network-service')
				})
			})
		})
		describe('Volume Specific Methods', () => {
			describe('createVolume', () => {
				it(`creates a docker network and returns the network id`, () => {
					return rawVolumeService.createVolume({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker create volume test error: ${error.message}`)
					})
				})
			})
			describe('getVolume', () => {
				it(`returns a docker network`, () => {
					return rawVolumeService.getVolume('')
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker get volume test error: ${error.message}`)
					})
				})
			})
			describe('listVolumes', () => {
				it(`returns a list of docker volumes`, () => {
					return rawVolumeService.listVolumes({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker list volumes test error: ${error.message}`)
					})
				})
			})
			describe('pruneVolumes', () => {
				it(`prunes volumes and returns list of volumes pruned`, () => {
					return rawVolumeService.pruneVolumes({})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker prune volumes test error: ${error.message}`)
					})
				})
			})
			describe('executeAction', () => {
				it(`executes remove volume command`, () => {
					return rawVolumeService.executeAction('Id', 'remove', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute remove volume action test error: ${error.message}`)
					})
				})
				it(`executes inspect volume command`, () => {
					return rawVolumeService.executeAction('Id', 'inspect', {})
					.then((results: any) => {
						expect(results).to.not.be.null
					})
					.catch((error: any) => {
						console.log(`docker execute inspect volume action test error: ${error.message}`)
					})
				})
			})
		})
	})
})
