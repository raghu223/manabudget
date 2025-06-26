import { utils, writeFile } from 'xlsx';

export function exportInvestmentsToExcel(investments) {
  const ws = utils.json_to_sheet(investments.map(inv => ({
    Name: inv.name,
    Category: inv.category,
    Principal: inv.principal,
    Rate: inv.rate,
    'Start Date': new Date(inv.startDate).toLocaleDateString(),
    'Accrued Interest': inv.interest,
    Total: inv.principal + inv.interest,
  })));
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Investments');
  writeFile(wb, 'investments.xlsx');
}
