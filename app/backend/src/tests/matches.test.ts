import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import Match from '../database/models/Match.model';

chai.use(chaiHttp);

const { expect } = chai;

const props = ['id','homeTeamId', 'homeTeamGoals', 'awayTeamId', 'awayTeamGoals', 'inProgress', 'homeTeam', 'awayTeam'];

const matches = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Grêmio"
    }
  },
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  }
]

const inProgress =  [{
  "id": 1,
  "homeTeamId": 16,
  "homeTeamGoals": 1,
  "awayTeamId": 8,
  "awayTeamGoals": 1,
  "inProgress": true,
  "homeTeam": {
    "teamName": "São Paulo"
  },
  "awayTeam": {
    "teamName": "Grêmio"
  }
}]


describe('Teste da rota /matches', () => {
  let chaiHttpResponse: Response;

  // beforeEach(async () => {
  //   sinon
  //     .stub(User, "findOne")
  //     .onFirstCall().resolves(user as User)
  //     .onCall(2).resolves(undefined)
  //     .onCall(3).resolves(undefined)
  // });

  // afterEach(()=>{
  // })

  it('GET - /matches - sucesso: lista de matches', async () => {
    sinon
    .stub(Match, "findAll")
    .resolves([...matches, ...inProgress] as any)

    chaiHttpResponse = await chai
        .request(app)
        .get('/matches')
    
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    props.forEach((prop) => expect(chaiHttpResponse.body[0]).to.haveOwnProperty(prop));

    (Match.findAll as sinon.SinonStub).restore();
  });

  it('GET - /matches?inProgress=true - sucesso: lista de matches in progresss', async () => {
    sinon
    .stub(Match, "findAll")
    .resolves(inProgress as any);

    chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=true')
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    props.forEach((prop) => expect(chaiHttpResponse.body[0]).to.haveOwnProperty(prop));
    chaiHttpResponse.body.forEach((e: {inProgress: boolean}) => expect(e.inProgress).to.be.true);

    (Match.findAll as sinon.SinonStub).restore();
  });

  it('GET - /matches?inProgress=false - sucesso: lista de matches in progresss', async () => {
    sinon
    .stub(Match, "findAll")
    .resolves(matches as any);

    chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=false')
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    props.forEach((prop) => expect(chaiHttpResponse.body[0]).to.haveOwnProperty(prop));
    chaiHttpResponse.body.forEach((e: {inProgress: boolean}) => expect(e.inProgress).to.be.false);

    (Match.findAll as sinon.SinonStub).restore();
  });

  it('POST - /matches - sucesso: retorna novo match', async () => {
    const userMatch = {
      "homeTeamId": 16,
      "awayTeamId": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
    };
    const dbInfo = {
      "id": 1,
      "inProgress": true
    };

    const validTokenReturn = await chai
    .request(app)
    .post('/login')
    .send({
      email: 'admin@admin.com',
      password: 'secret_admin'
    });
    const validToken = validTokenReturn.body.token;

    sinon
    .stub(Match, "create")
    .resolves({ ...userMatch, ...dbInfo } as any);

    chaiHttpResponse = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', validToken)
        .send(userMatch)
        
    expect(chaiHttpResponse.status).to.be.equals(201);
    expect(chaiHttpResponse.body).to.be.an('object');
    expect(chaiHttpResponse.body).to.be.deep.equal({ ...userMatch, ...dbInfo });
    expect(chaiHttpResponse.body.inProgress).to.be.true;

    (Match.create as sinon.SinonStub).restore();
  });

  it('PATCH - /matches/:id/finish - sucesso: mensagem "Finished"', async () => {
    sinon
    .stub(Match, "update")
    .resolves([1]);

    chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/1/finish')
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body.message).to.be.equal('Finished');

    (Match.update as sinon.SinonStub).restore();
  });

  it('PATCH - /matches/:id - sucesso: mensagem "Updated"', async () => {
    sinon
    .stub(Match, "update")
    .resolves([2]);

    chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/1')
        .send({
          "homeTeamGoals": 3,
          "awayTeamGoals": 1
        });
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body.message).to.be.equal('Updated');

    (Match.update as sinon.SinonStub).restore();
  });

});