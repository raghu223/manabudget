import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportInvestmentsToPDF(investments) {
  const doc = new jsPDF();
  const tableColumn = [
    'Name',
    'Category',
    'Principal',
    'Rate',
    'Start Date',
    'Accrued Interest',
    'Total',
  ];
  const tableRows = investments.map(inv => [
    inv.name,
    inv.category,
    inv.principal,
    inv.rate,
    new Date(inv.startDate).toLocaleDateString(),
    inv.interest,
    inv.principal + inv.interest,
  ]);
  doc.autoTable({ head: [tableColumn], body: tableRows });
  doc.save('investments.pdf');
}
