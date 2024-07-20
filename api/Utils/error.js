export const errorHandler = (Statuscode, message) => {
  const err = new Error();
  err.Statuscode = Statuscode || err.Statuscode;
  err.message = message || err.message;
  return err;
};
