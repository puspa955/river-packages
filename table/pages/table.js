import React, { useMemo } from "react";
import { DataTable } from "../src/DatasetTable";

export default function EmployeesPage() {
  const legalCasesData = [
  {
    id: 1,
    case_name: "बैकिङ कसुर (७३२)",
    district_name: "चितवन",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/अभियोग_1765692221.pdf",
    pdf_file_name: "अभियोग_1765692221.pdf",
    uploaded_ago: "5m ago"
  },
  {
    id: 2,
    case_name: "बैकिङ्ग कसुर",
    district_name: "ललीतपुर",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/प्रतिवादी राजेन्द्र प्रसाद दाहाल _1765691921.doc",
    pdf_file_name: "प्रतिवादी राजेन्द्र प्रसाद दाहाल _1765691921.doc",
    uploaded_ago: "5m ago"
  },
  {
    id: 3,
    case_name: "चोरी",
    district_name: "काठमाडौं",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/चोरी- उमेश बहादुर सुनार_20251214_0002_1765691764.pdf",
    pdf_file_name: "चोरी- उमेश बहादुर सुनार_20251214_0002_1765691764.pdf",
    uploaded_ago: "5m ago"
  },
  {
    id: 4,
    case_name: "बैङ्किङ कसूर",
    district_name: "पर्सा",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/बैङ्किङ कसूर- अमित बस्नेत_20251214_0003_1765691672.pdf",
    pdf_file_name: "बैङ्किङ कसूर- अमित बस्नेत_20251214_0003_1765691672.pdf",
    uploaded_ago: "5m ago"
  },
  {
    id: 5,
    case_name: "सवारी ज्यान",
    district_name: "धनुषा",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/सवारी ज्यान- योगेन्द्र चर्तिमगर_20251214_0001_1765690717.pdf",
    pdf_file_name: "सवारी ज्यान- योगेन्द्र चर्तिमगर_20251214_0001_1765690717.pdf",
    uploaded_ago: "25m ago"
  },
  {
    id: 6,
    case_name: "बहुबिवाह",
    district_name: "मोरङ",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/बहुबिवाह- लोकेश पुनमगर समेत २ जना_20251214_0001_1765690567.pdf",
    pdf_file_name: "बहुबिवाह- लोकेश पुनमगर समेत २ जना_20251214_0001_1765690567.pdf",
    uploaded_ago: "25m ago"
  },
  {
    id: 7,
    case_name: "अभद्र व्यवहार",
    district_name: "सुनसरी",
    case_date_bs: "2082-8-29",
    department_date: "2082-8-29",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/अभद्र व्यवहार- सुरेन्द्र राज भट्ट_20251214_0001_1765690394.pdf",
    pdf_file_name: "अभद्र व्यवहार- सुरेन्द्र राज भट्ट_20251214_0001_1765690394.pdf",
    uploaded_ago: "35m ago"
  },
  {
    id: 8,
    case_name: "जबरजस्ती करणी",
    district_name: "रौतहट",
    case_date_bs: "2082-8-26",
    department_date: "2082-8-26",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/रंजित कुमार गोईत यादव...जबरजस्ती करणी ।_1765529655.pdf",
    pdf_file_name: "रंजित कुमार गोईत यादव...जबरजस्ती करणी ।_1765529655.pdf",
    uploaded_ago: "12/12/2025"
  },
  {
    id: 9,
    case_name: "सवारी ज्यान",
    district_name: "बारा",
    case_date_bs: "2082-8-26",
    department_date: "2082-8-26",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/रामविहारी कामत....सवारी ज्यान ।_1765529817.pdf",
    pdf_file_name: "रामविहारी कामत....सवारी ज्यान ।_1765529817.pdf",
    uploaded_ago: "12/12/2025"
  },
  {
    id: 10,
    case_name: "चोरी",
    district_name: "महोत्तरी",
    case_date_bs: "2082-8-26",
    department_date: "2082-8-26",
    pdf_url: "https://ag.gov.np/storage/abhiyogPatra/रामचन्द्र मण्डल...चोरी ।_1765529739.pdf",
    pdf_file_name: "रामचन्द्र मण्डल...चोरी ।_1765529739.pdf",
    uploaded_ago: "12/12/2025"
  },
];


  const columns = useMemo(() => [
  {
    accessorKey: 'case_name',
    header: 'मुद्दाको नाम',
    cell: info => (
      <span className="font-medium text-gray-900">
        {info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'district_name',
    header: 'जिल्ला',
  },
  {
    accessorKey: 'case_date_bs',
    header: 'मिति (बि.स.)',
  },
  {
    accessorKey: 'uploaded_ago',
    header: 'अपलोड समय',
    cell: info => (
      <span className="text-sm text-gray-500">
        {info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'pdf_file_name',
    header: 'कागजात',
    cell: info => (
      <a 
        href={info.row.original.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
      >
        <span>📄</span>
        <span className="truncate max-w-[200px]">
          {info.getValue()}
        </span>
      </a>
    ),
  },
], []);

  return (
    <div className="space-y-6">
      <DataTable 
  data={legalCasesData}
  columns={columns}
  pageSize={5}
  onRowClick={(row) => window.open(row.pdf_url, '_blank')}
/>
    </div>
  );
}