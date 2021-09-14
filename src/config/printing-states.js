const printingStates = [
  {
    key: 'PREP',
    value: 'Preparation PDF',
  },
  {
    key: 'ON_PREP',
    value: 'In progress',
  },
  {
    key: 'EDITING',
    value: 'Editing',
  },
  {
    key: 'QC_PDF',
    value: 'QC PDF',
  },
  {
    key: 'ON_QC_PDF',
    value: 'In progress',
  },
  {
    key: 'PDF_READY',
    value: 'PDF ready',
  },
  {
    key: 'LAYOUTING',
    value: 'Layouting',
  },
  {
    key: 'PRINTING_VENDOR',
    value: 'Vendor printing',
  },
  {
    key: 'PRINTING',
    value: 'Printing at office',
  },
  {
    key: 'SHIPPING',
    value: 'Shipping',
  },
  {
    key: 'DONE',
    value: 'Input resi',
  },
  {
    key: 'RETURN',
    value: 'Retur in progress',
  },
  {
    key: 'RETURN_SENT',
    value: 'Retur terkirim',
  },
];

export default printingStates;
