import { SelectOption } from "@/components/ui/select";

export const USER_ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "All Roles" },
  { value: "HR", label: "HR" },
  { value: "EMPLOYEE", label: "Employee" },
];

export const ATTENDANCE_STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "true", label: "Attended" },
  { value: "false", label: "Not Attended" },
];

export const GENDER_OPTIONS: SelectOption[] = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

export const ATTENDANCE_ORDER_OPTIONS: SelectOption[] = [
  { value: "desc", label: "Latest" },
  { value: "asc", label: "Earliest" },
];

export const ALL_DEPARTMENTS_OPTION: SelectOption = {
  value: "",
  label: "All Departments",
};

export function getRoleFormOptions(isHRDept: boolean): SelectOption[] {
  return [
    { value: "EMPLOYEE", label: "Employee", disabled: isHRDept },
    { value: "HR", label: "HR", disabled: !isHRDept },
  ];
}
