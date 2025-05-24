import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('/users/sign_in', {
        username: username,
        password: password,
      });
      localStorage.setItem('status', response.status);


    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); 
      } else {
        setError('An error occurred. Please try again.'); 
      }
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              {error && <p className="text-danger">{error}</p>}

              <form onSubmit={handleSubmit}>
                <label htmlFor='username' className='form-label'>Username</label>
                <MDBInput                  
                  wrapperClass='mb-4 w-100' 
                  id='formControlLg' 
                  type='text' 
                  size="lg" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
                <label htmlFor='username' className='form-label'>Password</label>
                <MDBInput 
                  wrapperClass='mb-4 w-100' 
                  id='formControl' 
                  type='password' 
                  size="lg" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />

                <MDBCheckbox 
                  name='flexCheck' 
                  id='flexCheckDefault' 
                  className='mb-4' 
                  label='Remember password' 
                />

                <MDBBtn size='lg' className='my-3 w-100' type="submit">
                  Login
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
