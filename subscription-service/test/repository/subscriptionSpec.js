const expect = require('../Helpers/expect');

const repository = require('../../src/repository/subscription');
const { InternalServerError } = require('../../src/Errors');

describe('Repository Subscription', () => {
  it('should connect with a promise', () => {
    const fn = repository.connect({});
    return expect(fn).to.be.eventually.rejectedWith(InternalServerError)
        .and.to.have.property('message').that.deep.equals(
            'connection db not supplied!',
        );
  });
});
