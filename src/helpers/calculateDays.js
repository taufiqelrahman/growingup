export const calculateDays = (paidDate, targetDate) => {
  let _paidDate = new Date(paidDate);
  const currentDate = targetDate ? new Date(targetDate) : new Date();
  let numWorkDays = 0;

  while (_paidDate <= currentDate) {
    // Skips Sunday and Saturday
    if (_paidDate.getDay() !== 0 && _paidDate.getDay() !== 6) {
      numWorkDays++;
    }
    _paidDate.setDate(_paidDate.getDate() + 1);
  }

  // const diffTime = Math.abs(currentDate - _paidDate);
  // const days = 7 - Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return numWorkDays;
};
