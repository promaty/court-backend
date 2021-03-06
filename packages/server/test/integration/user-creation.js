import chai from 'chai'
import chaiHttp from 'chai-http'
import HttpStatus from 'http-status-codes'

import dbCleanup from '../helpers/dbCleanup'
const serverPort = process.env.SERVER_PORT || 8000
const { expect } = chai
chai.use(chaiHttp)
const TEST_ADDR = '0x6e26ADFa527BcC8B6aEf88716486cBdb4f7914e1'
const TEST_EMAIL = 'user@create.test'


describe('User creation', () => {

  // agent is used to persist authentication cookie across multiple tests
  const agent = chai.request.agent(`http://localhost:${serverPort}`)
  after(async () => {
    agent.close()
    await dbCleanup(TEST_ADDR)
  })

  it('should welcome user to the api', async () => {
    const res = await agent.get('/')
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body.message).to.equal('Welcome to Aragon Court server')
  })

  it('should create a new user', async () => {
    const res = await agent.post('/users').send({
      address: TEST_ADDR,
      email: TEST_EMAIL,
    })
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      created: true
    })
  })

  it('should return user with emailExists: true', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      emailExists: true,
      emailVerified: false,
      addressVerified: false,
      notificationsDisabled: false,
    })
  })

  it('should give existing user error', async () => {
    const res = await agent.post('/users').send({
      address: TEST_ADDR,
      email: TEST_EMAIL,
    })
    expect(res).to.have.status(HttpStatus.BAD_REQUEST)
  })
})
