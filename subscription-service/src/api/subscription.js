'use strict';

module.exports = ({ repo }, app) => {
  app.post('/subscribe', (req, res, next) => {
    const { validate } = req.container.cradle;

    validate(req.body.subscription, 'subscription')
      .then(subscription => {
        return repo.createSubscription(subscription);
      })
      .then(subscription => {
          console.log('sub: ', subscription);
        res.send({
            ok: true,
            data: subscription,
        });
      })
      .catch(next);
  });

  app.get('/unsubscribe/:id', (req, res, next) => {
    repo.cancelSubscription(req.params.id)
      .then(() => {
        res.send({ ok: true });
      })
      .catch(next);
  });

  app.get('/subscription/:id', (req, res, next) => {
    repo.getSubscriptionById(req.params.id)
      .then(subscription => {
        res.send({
            ok: true,
            data: subscription,
        });
      })
      .catch(next);
  });

  app.get('/subscriptions', (req, res, next) => {
    repo.getAllSubscriptions()
      .then(subscriptions => {
        res.send({
            ok: true,
            data: subscriptions,
        });
      })
      .catch(next);
  });
}
