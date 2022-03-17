import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
} from 'mdb-react-ui-kit';

export default function App() {
  return (
    <div>
      <MDBFooter className='text-center text-white'>
        <MDBContainer className='mt-4'>
       {/*   <section className='mt-4'>

          </section>*/}
          <section className='mt-4'>
    
            <a className='btn btn-outline-light btn-floating m-1' href='https://twitter.com/mjkid221' role='button' target="_blank" rel="noopener noreferrer">
              <MDBIcon fab icon='twitter' />
            </a>


            <a className='btn btn-outline-light btn-floating m-1' href='https://www.linkedin.com/in/minjae-mj-lee-23695918b/' target="_blank" role='button' rel="noopener noreferrer">
              <MDBIcon fab icon='linkedin-in' />
            </a>

            <a className='btn btn-outline-light btn-floating m-1' href='https://github.com/mj221' role='button' target="_blank" rel="noopener noreferrer">
              <MDBIcon fab icon='github' />
            </a>
          </section>


       
        </MDBContainer>

        <div className='text-center p-2' style={{ backgroundColor: '#1d1d1d' }}>
          <span className="text-muted">© {new Date().getFullYear()} Copyright&nbsp;|&nbsp;</span>
          <a className='text-white' href='.' rel="noopener noreferrer" style={{textDecoration: 'none'}}>
            GiX Exchange
          </a>
        </div>
      </MDBFooter>
    </div>
  );
}