import toast from 'react-hot-toast';

export const notifySorry = text => {
    toast.error(text, {
        duration: 1000,
        icon: '😞',
        id: 'sorry'
    });
}

export const notifyError = text => {
    toast.error(text, {
        duration: 2000,
        id: 'error'
    });
}

export const notifyPaint = text => {
    toast.success(text, {
        duration: 1000,
        icon: '🧑‍🎨',
        id: 'paint'
    });
};

export const notifySuccess = text => {
    toast.success(text, {
        duration: 1000,
        id: 'success'
    });
};