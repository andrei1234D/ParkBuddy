import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import noPaymentOptions from '../images/paymentMethods/noPaymentOptions.png';
import Checkbox from '@mui/material/Checkbox';
import GlobalStatesContext from '../context/GlobalStatesContext';
import '../style/PaymentMethod.css';
import LoadingSpinner from '../spinner/LoadingSpinner.js';

import api from '../api.js';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const PaymentMethod = () => {
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState({});
  const [loading, setLoading] = useState(true);
  const { username, role, firstName, translate } =
    useContext(GlobalStatesContext);

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const response = await api.post('/fetchPaymentMethods', {
          username,
          role,
        });
        setPaymentMethods(response.data.paymentMethods);

        // Set initial current payment method to the first active method
        const activeMethod = response.data.paymentMethods.find(
          (method) => method.isActive
        );
        if (activeMethod) {
          setCurrentPaymentMethod(activeMethod);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setLoading(false);
      }
    }

    fetchPaymentMethods();
  }, [username, role]);
  console.log(firstName);
  // Validation functions
  const validateCardNumber = (number) => {
    const re = /^\d{16}$/;
    return re.test(number);
  };

  const validateExpiryDate = (date) => {
    const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!re.test(date)) return false;

    const [month, year] = date.split('/');
    const expDate = new Date(`20${year}`, month);
    const currentDate = new Date();

    return expDate > currentDate;
  };

  const validateCvv = (cvv) => {
    const re = /^\d{3}$/;
    return re.test(cvv);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = translate('cardNumberError');
    }

    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = translate('expiryDateError');
    }

    if (!validateCvv(cvv)) {
      newErrors.cvv = translate('cvvError');
    }

    if (cardHolderName.trim() === '') {
      newErrors.cardHolderName = translate('cardHolderNameError');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newPaymentMethod = {
        isActive: true,
        bankName,
        cardNumber,
        expiryDate,
        cvv,
        cardHolderName,
      };
      setCurrentPaymentMethod(newPaymentMethod);
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setSuccessMessage(true);

      // Clear the form
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardHolderName('');

      // Hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(false), 3000);

      try {
        const response = await api.post('/addPaymentMethod', {
          username,
          role,
          newPaymentMethod,
        });
        console.log('Payment method added:', response.data.message);
      } catch (error) {
        console.error('Payment add failed', error.response?.data?.message);
      }
    }
  };

  const handleChangeActivePaymentMethod = async (paymentMethodIndex) => {
    try {
      const response = await api.post('/changeActivePaymentMethod', {
        username,
        role,
        paymentMethodIndex,
      });

      console.log('Active payment method changed:', response.data.message);
    } catch (error) {
      console.error('Payment change failed:', error.response?.data?.message);
    }
  };

  const paymentToggle = () => {
    setShowPayments(!showPayments);
  };

  const handleCheckboxChange = (method) => {
    setCurrentPaymentMethod(method);
    // Call the method to change active payment method
    const methodIndex = paymentMethods.findIndex((m) => m === method);
    handleChangeActivePaymentMethod(methodIndex);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {showPayments ? (
        <div className="payment-method-container">
          <button onClick={paymentToggle}>
            {translate('yourPaymentMethods')}
          </button>
          <h2>{translate('enterPaymentDetails')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="bankName">{translate('bankName')}</label>
              <input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
              <label htmlFor="cardNumber">{translate('cardNumber')}</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
              {errors.cardNumber && (
                <span className="error">{errors.cardNumber}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">{translate('expiryDate')}</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <span className="error">{errors.expiryDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="cvv">{translate('cvv')}</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="cardHolderName">
                {translate('cardHolderName')}
              </label>
              <input
                type="text"
                id="cardHolderName"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                required
              />
              {errors.cardHolderName && (
                <span className="error">{errors.cardHolderName}</span>
              )}
            </div>
            <button type="submit">{translate('addPaymentMethod')}</button>
          </form>
          {successMessage && (
            <div className="success-message">
              <div className="tick">✔</div>
              <p>{translate('paymentMethodAdded')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="payment-method-container">
          <button onClick={paymentToggle}>
            {translate('addAdditionalPaymentMethods')}
          </button>
          {paymentMethods.length > 0 ? (
            <div>
              <h2>{translate('yourPaymentMethods')}</h2>
              <div className="alignCenter">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox
                      {...label}
                      checked={currentPaymentMethod === method}
                      onChange={() => handleCheckboxChange(method)}
                    />
                    <div>
                      {method.bankName} - {method.cardNumber} -{' '}
                      {method.expiryDate} - {method.cardHolderName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '20px',
              }}
            >
              <img
                src={noPaymentOptions}
                style={{ width: '100%', height: '100%' }}
                alt={translate('noPaymentOptions')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
