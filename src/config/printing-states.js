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
    key: 'PRINTING',
    value: 'Printing & shipping',
  },
  {
    key: 'DONE',
    value: 'Done (Input resi)',
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
