import React from 'react'

import Modal from '../../../shared/components/UIElements/Modal';
import Close from '@mui/icons-material/Close';

const DeleteJobModal = ({deleteJobModal, setDeleteJobModal, cancelDeleteJob, confirmDeleteJob}) => {
    return (
        <Modal 
            show={deleteJobModal}
            onCancel={() => setDeleteJobModal(false)}
            header={
                <div className='flex justify-between px-4 border-b-1 border-zinc-200 p-2'>
                    <h2 className='text-lg font-semibold'>Delete Job</h2>
                    <button onClick={() => setDeleteJobModal()}>                        
                        <Close />
                    </button>
                </div>
            }
            className='w-1/3 left-1/3'
            footer={
                <div className='bg-zinc-200 p-2 rounded-b-md space-x-4 text-right w-full' >
                    <button onClick={cancelDeleteJob}>cancel</button>
                    <button className='bg-red-400 text-white p-1 px-2 rounded-md'onClick={confirmDeleteJob}>Delete</button>
                </div>
            }
        > 
            <div className='text-center p-4 text-lg w-full '>
                <p>Are you sure you want to delete job?</p>
                <p>You cannot undo this action</p>
            </div>
        </Modal>
    )
}

export default DeleteJobModal