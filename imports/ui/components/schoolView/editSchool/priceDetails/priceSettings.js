import ClassPriceForm from './classPriceForm';
import MonthlyPriceForm from './monthlyPriceForm';

export const monthlyPriceSettings = {
  mainPanelHeader: {
    leftIcon: 'assignment',
    title: 'Per Month Packages',
    titleKey: 'packageName',
    actions: {
      component: MonthlyPriceForm,
      buttonTitle: 'ADD MONTHLY PACKAGES',
      onSubmit: 'addMonthlyPackage',
      title: 'Monthly Packages',
      formFields: [
        {
          key: 'packageName', label: 'Package Name', type: 'text', required: true,
        },
        {
          key: 'classTypeId',
          label: 'Covers Class Type',
          type: 'auto-select',
          required: false,
          method: 'classType.getClassType',
          suggestion: 'name',
          suggestionData: null,
          valueField: '_id',
          onLoad: true,
          filterKeys: ['schoolId'],
          multi: true,
        },
        {
          key: 'pymtType',
          label: 'Payment Type',
          type: 'select',
          required: false,
          defaultOption: 'Payment Type',
          options: [
            { label: 'Automatic Withdrawal', value: 'Automatic Withdrawal' },
            { label: 'Pay As You Go', value: 'Pay As You Go' },
          ],
        },
        {
          key: 'oneMonCost', label: '1 Month Package', type: 'number', required: false,
        },
        {
          key: 'threeMonCost', label: '3 Month Package', type: 'number', required: false,
        },
        {
          key: 'sixMonCost', label: '6 Month Package', type: 'number', required: false,
        },
        {
          key: 'annualCost', label: '1 Year Rate', type: 'number', required: false,
        },
        {
          key: 'lifetimeCost', label: 'LifeTime Cost', type: 'number', required: false,
        },
      ],
    },
  },
  mainTable: {
    title: 'Monthly Packages',
    tableFields: [
      { key: 'packageName', label: 'Package Name' },
      { key: 'pymtType', label: 'Package Type' },
      { key: 'oneMonCost', label: '1 Month Package' },
      { key: 'threeMonCost', label: '3 Month Package' },
      { key: 'sixMonCost', label: '6 Month Package' },
      { key: 'annualCost', label: '1 Year Rate' },
      { key: 'lifetimeCost', label: 'LifeTime Cost' },
    ],
    actions: {
      component: MonthlyPriceForm,
      label: 'Actions',
      toggleChildTable: false,
      edit: {
        title: 'Monthly Packages',
        onSubmit: 'editMonthlyPackage',
        editByField: '_id',
        formFields: [
          {
            key: 'packageName', label: 'Package Name', type: 'text', required: true,
          },
          {
            key: 'classTypeId',
            label: 'Covers Class Type',
            type: 'auto-select',
            required: false,
            method: 'classType.getClassType',
            suggestion: 'name',
            suggestionData: null,
            valueField: '_id',
            onLoad: true,
            filterKeys: ['schoolId'],
            multi: true,
          },
          {
            key: 'pymtType',
            label: 'Payment Type',
            type: 'select',
            required: false,
            defaultOption: 'Payment Type',
            options: [
              { label: 'Automatic Withdrawal', value: 'Automatic Withdrawal' },
              { label: 'Pay As You Go', value: 'Pay As You Go' },
            ],
          },
          {
            key: 'oneMonCost', label: '1 Month Package', type: 'text', required: false,
          },
          {
            key: 'threeMonCost', label: '3 Month Package', type: 'text', required: false,
          },
          {
            key: 'sixMonCost', label: '6 Month Package', type: 'text', required: false,
          },
          {
            key: 'annualCost', label: '1 Year Rate', type: 'text', required: false,
          },
          {
            key: 'lifetimeCost', label: 'LifeTime Cost', type: 'text', required: false,
          },
        ],
      },
      delete: 'removeMonthlyPackage',
    },
  },
};

export const classPriceSettings = {
  mainPanelHeader: {
    leftIcon: 'assignment',
    title: 'Per Class Packages',
    titleKey: 'packageName',
    actions: {
      component: ClassPriceForm,
      buttonTitle: 'ADD CLASS PACKAGES',
      onSubmit: 'addClassPackage',
      title: 'Class Packages',
      formFields: [
        {
          key: 'packageName', label: 'Package Name', type: 'text', required: true,
        },
        {
          key: 'cost', label: 'Cost', type: 'number', required: true,
        },
        {
          key: 'classTypeId',
          label: 'Covers Class Type',
          type: 'auto-select',
          required: false,
          method: 'classType.getClassType',
          suggestion: 'name',
          suggestionData: null,
          valueField: '_id',
          onLoad: true,
          filterKeys: ['schoolId'],
          multi: true,
        },
        {
          key: 'noClasses', label: 'Number of Classes', type: 'text', required: false,
        },
        {
          key: 'start', label: 'Expires', type: 'number', required: false,
        },
        {
          key: 'finish',
          label: 'Expire Type',
          type: 'select',
          required: false,
          defaultOption: 'Select',
          options: [
            { label: 'Days', value: 'Days' },
            { label: 'Months', value: 'Months' },
            { label: 'Year', value: 'Year' },
          ],
        },
      ],
    },
  },
  mainTable: {
    title: 'Class Packages',
    tableFields: [
      { key: 'packageName', label: 'Package Name' },
      { key: 'cost', label: 'Cost' },
      { key: 'noClasses', label: 'Number of Classes' },
      { key: 'start', label: 'Expires' },
      { key: 'finish', label: 'Expires Type' },
    ],
    actions: {
      label: 'Actions',
      toggleChildTable: false,
      edit: {
        component: ClassPriceForm,
        title: 'Class Packages',
        onSubmit: 'editClassPackage',
        editByField: '_id',
        formFields: [
          {
            key: 'packageName', label: 'Package Name', type: 'text', required: true,
          },
          {
            key: 'cost', label: 'Cost', type: 'number', required: true,
          },
          {
            key: 'classTypeId',
            label: 'Covers Class Type',
            type: 'auto-select',
            required: false,
            method: 'classType.getClassType',
            suggestion: 'name',
            suggestionData: null,
            valueField: '_id',
            onLoad: true,
            filterKeys: ['schoolId'],
            multi: true,
          },
          {
            key: 'noClasses', label: 'Number of Classes', type: 'text', required: false,
          },
          {
            key: 'start', label: 'Expires', type: 'number', required: false,
          },
          {
            key: 'finish',
            label: 'Expire Type',
            type: 'select',
            required: false,
            defaultOption: 'Select',
            options: [
              { label: 'Days', value: 'Days' },
              { label: 'Months', value: 'Months' },
              { label: 'Year', value: 'Year' },
            ],
          },
        ],
      },
      delete: 'removeClassPackage',
    },
  },
};
