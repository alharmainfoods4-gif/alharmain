import React from 'react';

const FormInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {label}
                </label>
            )}
            <input className="input" {...props} />
            {error && <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default FormInput;
