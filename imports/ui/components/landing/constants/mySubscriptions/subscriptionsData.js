import uuid from 'uuid/v4';

export const subscriptionsData = [
    {
        _id: uuid(),
        name: 'classType',
        classTimes: [
            {
                _id: uuid(),
                name: 'classTime 1'
            },
            {
                _id: uuid(),
                name: 'classTime 2'
            }
        ]
    },
    {
        name: 'Class Type 2',
        classTimes: [
            {
                _id: uuid(),
                name: 'classTime 1'
            },
            {
                _id: uuid(),
                name: 'classTime 2'
            }
        ]
    }
]