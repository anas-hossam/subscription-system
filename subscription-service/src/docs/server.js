'use strict';

const express = require('express');
const { EventEmitter } = require('events');
const { asValue } = require('awilix');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./open-api/specs.json');

const repository = require('../repository/subscription');
const { createToken } = require('../utilities');
const { Mail } = require('../Services');
const middlewares = require('../middlewares');
const _api = require('../api/subscription');
const di = require('../config');

const mediator = new EventEmitter();

const PORT = 4040;

mediator.on('di.ready', (container) => {
    container.register({
        createToken: asValue(createToken),
    });

    repository.connect(container)
        .then(repo => {
            console.log('Connected. Starting Server');

            container.register({
                repo: asValue(repo),
                middlewares: asValue(middlewares),
            });

            return new Mail({
                mailApi: container.resolve('mailApi'),
                createToken: container.resolve('createToken'),
            });
        })
        .then(service => {
            container.register({
                mailService: asValue(service),
            });

            return new Promise((resolve, reject) => {
                const { tokenSecret } = container.resolve('serverSettings');
                const repo = container.resolve('repo');
                const mailService = container.resolve('mailService');
                const { authenticate } = container.resolve('middlewares');
                
                const app = express();

                // Create route to generate jwt token to be used in authorization
                const generateTokenPath = '/token-generator';
                app.get(generateTokenPath, async(req, res) => {
                    const token = await createToken({
                        first_name: "Anas Hossam",
                        email: "softeng.anas@gmail.com",
                        gender: "male",
                        is_active: true,
                        date_of_birth: "1992-03-17",
                        newsletter_id: "232323232323"
                    });

                    res.send(token);
                });

                const options = {
                    customCss: `.swagger-ui .dialog-ux .modal-ux-content h4::after {
                        content: ". To generate token, GET ${generateTokenPath}"
                        }`,
                };

                app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

                app.use(authenticate({
                    secret: tokenSecret,
                }));
        
                app.use((req, res, next) => {
                    req.container = container.createScope();
                    next();
                });
        
                const api = _api.bind(null, { repo, mailService });
                api(app);
        
                const server = app.listen(PORT, () => resolve(server));
            })
        })
        .then(app => {
            console.log(`Server started successfully, running on port: '${PORT} locally', '39812 docker' and endpoint: docs`);
            app.on('close', () => {
                container.resolve('repo').disconnect();
            });
        });
});

di.init(mediator);

mediator.emit('init');
