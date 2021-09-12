export default (error, req, res, next) => { // eslint-disable-line
  console.log('error', error); // eslint-disable-line
  console.log('error', JSON.stringify(error)); // eslint-disable-line

  res.status(error.status ? error.status : 500).send({ error });
};
