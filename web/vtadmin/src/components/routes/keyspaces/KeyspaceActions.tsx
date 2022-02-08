import React, { useState } from 'react';
import Dropdown from '../../dropdown/Dropdown';
import MenuItem from '../../dropdown/MenuItem';
import { Icon, Icons } from '../../Icon';
import Dialog from '../../dialog/Dialog'
import Toggle from '../../toggle/Toggle';
import { useValidateKeyspace } from '../../../hooks/api';

interface KeyspaceActionsProps {
    keyspace: string
    clusterID: string
}

const KeyspaceActions: React.FC<KeyspaceActionsProps> = ({ keyspace, clusterID }) => {
    const [isOpen, setIsOpen] = useState(false);
    const closeDialog = () => setIsOpen(false);
    const openDialog = () => {
        setIsOpen(true);
    };

    const [pingTablets, setPingTablets] = useState(false)

    const validateKeyspaceMutation = useValidateKeyspace(
        { keyspace, clusterID, pingTablets }
    );

    return (
        <div className="w-min inline-block">
            <Dropdown dropdownButton={Icons.info} position="bottom-right">
                <MenuItem onClick={openDialog}>Validate Keyspace</MenuItem>
            </Dropdown>
            <Dialog
                isOpen={isOpen}
                confirmText="Validate"
                cancelText="Cancel"
                onConfirm={validateKeyspaceMutation.mutate}
                loadingText="Validating..."
                loading={validateKeyspaceMutation.isLoading}
                onCancel={closeDialog}
                onClose={() => {
                    validateKeyspaceMutation.reset()
                    setPingTablets(false)
                    closeDialog()
                }}
                title="Validate Keyspace"
                description={`Validates that all nodes reachable from keyspace "${keyspace}" are consistent.`}
            >
                <div className="w-full">
                    {!validateKeyspaceMutation.error && !validateKeyspaceMutation.data && (
                        <div className="flex justify-between items-center w-full p-2 border border-vtblue rounded-md">
                            <div className="mr-2">
                                <h5 className="font-medium m-0">Ping Tablets</h5>
                                <p className="m-0 text-sm">If enabled, all tablets will also be pinged during the validation process.</p>
                            </div>
                            <Toggle enabled={pingTablets} onChange={() => setPingTablets(!pingTablets)} />
                        </div>
                    )}
                    {validateKeyspaceMutation.data && (
                        <div className="w-full flex flex-col justify-center items-center border rounded-md border-green-500 p-4">
                            <span className="flex relative w-full">
                                <Icon className="fill-current text-green-500" icon={Icons.checkSuccess} />
                                <div className="ml-2">
                                    <h5 className="font-bold">Validated keyspace</h5>
                                    {validateKeyspaceMutation.data.results.length === 0 && <div className="italic text-gray-500">No validation errors found.</div>}
                                    {validateKeyspaceMutation.data.results.length > 0 &&
                                        <ul>
                                            {validateKeyspaceMutation.data.results.map((res, i) => <li key={`keyspace_validation_result_${i}`}>• {res}</li>)}
                                        </ul>
                                    }
                                </div>
                            </span>
                        </div>
                    )
                    }
                </div>
            </Dialog>
        </div>
    );
};

export default KeyspaceActions;
