const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('./index');
const config = require('./configs');

describe('POST /register-mail', () => {
    // it('it should POST /register-mail success', () => {
    //     return request(app)
    //         .post('/api/v1/users/register-mail')
    //         .send({ 
    //             firstname: 'nsd_test1',
    //             lastname: 'nsd_test1',
    //             email: 'nsd_test1@gmail.com',
    //             password: '786b726a72647368',
    //             grant_type: 'email'
    //         })
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    // });
});

describe('POST /login-email', () => {
    it('it should GET /login-email success.', () => {
        return request(app)
            .post('/api/v1/users/login-email')
            .send({ email: 'nsd_test1@gmail.com', password: '786b726a72647368' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        token_type: 'Bearer',
                        access_token: expect.any(String),
                        refresh_token: expect.any(String),
                    }),
                );
            });
    });

    it('it should POST /login-email FAIL case body is empty.', () => {
        return request(app)
            .post('/api/v1/users/login-email')
            .expect('Content-Type', /json/)
            .expect(403)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        statusCode: 403,
                        data: {
                            error: 'Missing or invalid parameter'
                        }
                    })
                );
            });
    });

    it('it should POST /login-email FAIL case password incorrect.', () => {
        return request(app)
            .post('/api/v1/users/login-email')
            .send({ email: 'nsd_test1@gmail.com', password: 'safdgeeqrqrqe' })
            .expect('Content-Type', /json/)
            .expect(401)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        statusCode: 401,
                        data: {
                            error: 'Password incorrect'
                        }
                    })
                );
            });
    });
});

describe('POST /refresh-token', () => {
    var refreshToken;
    beforeEach(function () {
        refreshToken = jwt.sign({ user_id: 'f3b10c19b476470aba7f21955b86e631' }, config.secret, { expiresIn: config.refreshTokenExpiresIn })
    });

    it('it should POST /refresh-token success', () => {
        return request(app)
            .post('/api/v1/users/refresh-token')
            .set('authorization', `Bearer ${refreshToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        token_type: 'Bearer',
                        access_token: expect.any(String),
                        refresh_token: expect.any(String),
                    }),
                );
            });
    });
});