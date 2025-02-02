import React, { useContext, useRef, useState } from 'react';
import { FaTrash, FaUserMinus, FaKey } from 'react-icons/fa'; // Import icons
import NoteContext from '../context/notes/noteContext';

const Settings = () => {
  document.title = "MyNottebok - Settings";
  const noteContext = useContext(NoteContext);
  const { deleteAllNotes, deleteAccount, updatePassword } = noteContext;

  const [password, setPassword] = useState({ opassword: '', npassword: '', cpassword: '' });
  const modalCloseRef = useRef(null);

  const handleDeleteAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes?')) {
      deleteAllNotes();
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccount();
      localStorage.removeItem('auth-token');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(password.opassword, password.npassword);
      if (modalCloseRef.current) {
        modalCloseRef.current.click(); // This triggers the modal close
      }
      setPassword({ opassword: '', npassword: '', cpassword: '' }); // Clear password fields
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <div className='container'>
      <h1 className='text-center mb-4'>Settings</h1>
      <p className='text-muted text-center'>Only accessible if logged in.</p>
      <div className='danger-zone p-3 mb-4'>
        <h2 className='text-danger mb-3'>Danger Zone</h2>
        <div className='table-responsive'>
          <table className='table'>
            <tbody>
            <tr>
                <td>Change Password:</td>
                <td>
                  <button
                    className='btn btn-warning'
                    data-bs-toggle='modal'
                    data-bs-target='#changePasswordModal'
                  >
                    <FaKey className='me-1' /> Change Password
                  </button>
                </td>
              </tr>
              <tr>
                <td>Delete my all notes:</td>
                <td>
                  <button className='btn btn-danger' onClick={handleDeleteAllNotes}>
                    <FaTrash className='me-1' /> Delete All Notes
                  </button>
                </td>
              </tr>
              <tr>
                <td>Not need MyNottebok anymore:</td>
                <td>
                  <button className='btn btn-danger' onClick={handleDeleteAccount}>
                    <FaUserMinus className='me-1' /> Delete Account
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      <div
        className='modal fade'
        id='changePasswordModal'
        tabIndex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Change Password
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                ref={modalCloseRef}
              ></button>
            </div>
            <div className='modal-body'>
              <form>
                <div className='form-group my-3'>
                  <label htmlFor='opassword'>Old Password</label>
                  <input
                    type='password'
                    className='form-control'
                    id='opassword'
                    name='opassword'
                    placeholder='Old Password'
                    onChange={onChange}
                    value={password.opassword}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='npassword'>New Password</label>
                  <input
                    type='password'
                    className='form-control'
                    id='npassword'
                    name='npassword'
                    placeholder='New Password'
                    onChange={onChange}
                    value={password.npassword}
                    minLength={8}
                    required
                  />
                </div>
                <div className='form-group my-3'>
                  <label htmlFor='cpassword'>Confirm Password</label>
                  <input
                    type='password'
                    className='form-control'
                    id='cpassword'
                    name='cpassword'
                    placeholder='Confirm Password'
                    onChange={onChange}
                    value={password.cpassword}
                    minLength={8}
                    required
                  />
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Cancel
              </button>
              <button
                disabled={
                  password.opassword.length === 0 ||
                  password.npassword.length < 8 ||
                  password.npassword !== password.cpassword
                }
                type='button'
                className='btn btn-primary'
                onClick={handleUpdatePassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
