import React from 'react'

import Modal from '../../../shared/components/UIElements/Modal'
import Close from '@mui/icons-material/Close';

const CompleteJobModal = ({statusModal, cancelStatusModal, setStatusModal, confirmStatusModal, jobInfo}) => {
    return (
        <Modal 
        show={statusModal}
        onCancel={cancelStatusModal}
        header={
            <div className='flex justify-between px-4 border-b-1 border-zinc-200 p-2'>
                {jobInfo && (jobInfo.status === 1 ? 
                    <h2 className='text-lg font-semibold'>Reset Job</h2>
                    :<h2 className='text-lg font-semibold'>Complete Job</h2>)
                }
                <button onClick={() => setStatusModal(false)}>                        
                    <Close />
                </button>
            </div>
        }
        className='w-1/3 left-1/3'
        footer={
            <div className='bg-zinc-200 p-2 rounded-b-md space-x-4 text-right w-full' >
                <button onClick={cancelStatusModal}>cancel</button>
                <button 
                    className='bg-emerald-600 text-white p-1 px-2 rounded-md'
                    onClick={() => confirmStatusModal(jobInfo.status === 1 ? 0 : 1) }
                >
                    Confirm
                </button>
            </div>
        }
    > 
        <div className='text-center p-4 text-lg w-full'>
            {jobInfo && (jobInfo.status === 1 ? 
                <p>Are you sure you want to reset this Job? </p>
                :<p>Are you sure you want to mark the job as Complete?</p>)
            }
        </div>
    </Modal>
    )
}

export default CompleteJobModal