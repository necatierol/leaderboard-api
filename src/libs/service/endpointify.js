const makeHandler = (handler) => (async (req, res, next) => {
  try {
    const response = await handler(req, res, (params) => {
      if (params) next(params);
      else next();
    });

    if (response) {
      res.send(response.status, response.body);
    }
  } catch (error) {
    next(error);
  }
});

export default makeHandler;
