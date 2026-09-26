"use client";

import React, { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user.service";
import { departmentService } from "@/services/department.service";
import { User } from "@/types/user";
import { DepartmentDropdownItem } from "@/types/department";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatDate } from "@/lib/date-utils";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER, DS_FOCUS } from "@/constants/design-system";
import {
  USER_ROLE_FILTER_OPTIONS,
  ATTENDANCE_STATUS_FILTER_OPTIONS,
  GENDER_OPTIONS,
  ALL_DEPARTMENTS_OPTION,
  getRoleFormOptions,
} from "@/constants/dropdown-options";
import { useDebounce } from "@/hooks/use-debounce";

export function MasterUserView() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<DepartmentDropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedAttend, setSelectedAttend] = useState<string>("");

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [formName, setFormName] = useState("");
  const [formGender, setFormGender] = useState<"M" | "F">("M");
  const [formDept, setFormDept] = useState("");
  const [formIsHR, setFormIsHR] = useState(false);
  const [formNip, setFormNip] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    departmentService
      .getDropdown()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDepartments(res.data);
          if (res.data.length > 0 && !formDept) {
            setFormDept(res.data[0].code);
          }
        }
      })
      .catch(() => {});
  }, [formDept]);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await userService.getUsers({
        search: debouncedSearch.trim() || undefined,
        department: selectedDept || undefined,
        is_attend: selectedAttend !== "" ? selectedAttend === "true" : undefined,
        limit: 100,
      });

      let loaded = res.data;
      if (selectedRole === "HR") {
        loaded = loaded.filter((u) => u.isHR);
      } else if (selectedRole === "EMPLOYEE") {
        loaded = loaded.filter((u) => !u.isHR);
      }

      setUsers(loaded);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedRole, selectedDept, selectedAttend]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setSelectedUserIds([]);
  }, [debouncedSearch, selectedRole, selectedDept, selectedAttend]);

  const isAllSelected = users.length > 0 && selectedUserIds.length === users.length;
  const isPartiallySelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleToggleSelect = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      setIsProcessing(true);
      await userService.deleteMultipleUsers(selectedUserIds);
      showToast({
        title: "Users Deleted",
        description: `Successfully deleted ${selectedUserIds.length} users`,
        type: "success",
      });
      setSelectedUserIds([]);
      setIsBulkDeleteModalOpen(false);
      loadUsers();
    } catch {
      showToast({
        title: "Failed to Delete",
        description: "An error occurred while deleting selected users",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDepartmentChange = (deptCode: string) => {
    setFormDept(deptCode);
    if (deptCode === "HR") {
      setFormIsHR(true);
    } else {
      setFormIsHR(false);
    }
  };

  const handleOpenCreate = () => {
    const initialDept = departments[0]?.code || "HR";
    setEditingUser(null);
    setFormName("");
    setFormGender("M");
    setFormDept(initialDept);
    setFormIsHR(initialDept === "HR");
    setFormNip("");
    setFormPassword("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    const currentDept = user.department?.code || departments[0]?.code || "HR";
    setEditingUser(user);
    setFormName(user.name);
    setFormGender((user.gender as "M" | "F") || "M");
    setFormDept(currentDept);
    setFormIsHR(currentDept === "HR");
    setFormNip(user.nip);
    setFormPassword("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) {
      errors.name = "Full name is required";
    }
    if (!formDept) {
      errors.department = "Department is required";
    }
    if (!editingUser && !formPassword.trim()) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsProcessing(true);
      if (editingUser) {
        await userService.updateUser(editingUser.id, {
          name: formName.trim(),
          gender: formGender,
          departmentCode: formDept,
          isHR: formDept === "HR",
          password: formPassword || undefined,
        });
        showToast({
          title: "User Updated",
          description: `User ${formName} was successfully updated`,
          type: "success",
        });
      } else {
        await userService.createUser({
          name: formName.trim(),
          gender: formGender,
          departmentCode: formDept,
          isHR: formDept === "HR",
          password: formPassword.trim(),
        });
        showToast({
          title: "User Created",
          description: `New user ${formName} was successfully registered`,
          type: "success",
        });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: unknown) {
      const error = err as { error?: { message?: string } };
      showToast({
        title: "Failed to Save",
        description: error?.error?.message || "An error occurred while saving user data",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsProcessing(true);
      await userService.deleteUser(deleteTarget.id);
      showToast({
        title: "User Deleted",
        description: `User ${deleteTarget.name} has been deleted`,
        type: "success",
      });
      setSelectedUserIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      loadUsers();
    } catch {
      showToast({
        title: "Failed to Delete",
        description: "An error occurred while deleting user",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className={`shadow-xs ${DS_BORDER.default}`}>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 min-h-[76px]">
          <div>
            <CardTitle className={`text-base font-bold ${DS_TEXT.primary} tracking-tight`}>
              User Management
            </CardTitle>
            <CardDescription className={`text-xs ${DS_TEXT.secondary} mt-1`}>
              View and manage all users in the system.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className={`text-xs font-semibold h-9 px-3.5 ${DS_TEXT.inverse} shrink-0`}
          >
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden">Add User</span>
          </Button>
        </CardHeader>
      </Card>

      <Card className={`p-5 shadow-xs ${DS_BORDER.default} space-y-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className={`text-xs font-medium ${DS_TEXT.primary} mb-1.5 block`}>
              Search Keywords
            </label>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${DS_TEXT.secondary}`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or NIP..."
                className={`w-full h-9 pl-9 pr-3 py-2 text-xs border ${DS_BORDER.strong} rounded-lg ${DS_TEXT.primary} ${DS_FOCUS.ring} ${DS_BG.surface}`}
              />
            </div>
          </div>

          <SelectField
            label="Role"
            value={selectedRole}
            onValueChange={setSelectedRole}
            options={USER_ROLE_FILTER_OPTIONS}
          />

          <SelectField
            label="Department"
            value={selectedDept}
            onValueChange={setSelectedDept}
            options={[
              ALL_DEPARTMENTS_OPTION,
              ...departments.map((dept) => ({
                value: dept.code,
                label: `${dept.name} (${dept.code})`,
              })),
            ]}
          />

          <SelectField
            label="Today Attendance"
            value={selectedAttend}
            onValueChange={setSelectedAttend}
            options={ATTENDANCE_STATUS_FILTER_OPTIONS}
          />
        </div>
      </Card>

      {selectedUserIds.length > 0 && (
        <div className={`sticky top-[68px] z-20 ${DS_BG.dark} ${DS_TEXT.inverse} rounded-xl shadow-md border ${DS_BORDER.darkContainer} p-3 sm:p-3.5 transition-all`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${DS_TEXT.inverse}`}>
                  {selectedUserIds.length} of {users.length} selected
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={`text-xs px-2.5 py-1.5 rounded-lg ${DS_BG.darkSubtle} ${DS_BG.darkSubtleHover} ${DS_TEXT.inverse} border ${DS_BORDER.dark} transition-colors font-medium cursor-pointer`}
                >
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserIds([])}
                  className={`text-xs px-2.5 py-1.5 rounded-lg ${DS_BG.darkSubtle} ${DS_BG.darkSubtleHover} ${DS_TEXT.inverse} border ${DS_BORDER.dark} transition-colors font-medium cursor-pointer`}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className={`flex items-center justify-end ${DS_BORDER.darkContainer} pt-2.5 sm:pt-0`}>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold ${DS_TEXT.inverse} ${DS_BG.danger} ${DS_BG.dangerHover} border ${DS_BORDER.danger} rounded-lg transition-colors cursor-pointer`}
              >
                <Trash2 className={`w-4 h-4 ${DS_TEXT.inverse} shrink-0`} />
                <span>Delete Selected ({selectedUserIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <Card className={`p-12 text-center ${DS_TEXT.secondary} text-sm shadow-xs ${DS_BORDER.default}`}>
          Loading users...
        </Card>
      ) : users.length === 0 ? (
        <Card className={`p-12 text-center shadow-xs ${DS_BORDER.default} space-y-2`}>
          <Users className={`w-8 h-8 ${DS_TEXT.secondary} mx-auto`} />
          <p className={`text-sm font-semibold ${DS_TEXT.primary}`}>No Users Found</p>
          <p className={`text-xs ${DS_TEXT.secondary}`}>Try adjusting your search keywords or filters.</p>
        </Card>
      ) : (
        <>
          <div className={`hidden lg:block ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 px-3 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all users"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartiallySelected;
                      }}
                      onChange={handleSelectAll}
                      className={`h-4 w-4 rounded ${DS_BORDER.strong} ${DS_TEXT.primary} ${DS_FOCUS.checkbox} cursor-pointer`}
                    />
                  </TableHead>
                  <TableHead className="text-center">Name & ID</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Department</TableHead>
                  <TableHead className="text-center">Gender</TableHead>
                  <TableHead className="text-center">Today Attendance</TableHead>
                  <TableHead className={`text-center sticky right-0 z-20 ${DS_BG.app} min-w-[140px]`}>
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                    <TableRow
                      key={u.id}
                      className={`group transition-colors ${
                        isSelected ? DS_BG.app : DS_BG.appHover
                      }`}
                    >
                      <TableCell className="w-12 px-3 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select ${u.name}`}
                          checked={isSelected}
                          onChange={() => handleToggleSelect(u.id)}
                          className={`h-4 w-4 rounded ${DS_BORDER.strong} ${DS_TEXT.primary} ${DS_FOCUS.checkbox} cursor-pointer`}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div>
                          <span className={`font-semibold ${DS_TEXT.primary} block`}>{u.name}</span>
                          <span className={`text-[11px] ${DS_TEXT.secondary} block tabular-nums`}>NIP: {u.nip}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={u.isHR ? "warning" : "info"}>
                          {u.isHR ? "HR" : "Employee"}
                        </Badge>
                      </TableCell>
                      <TableCell className={`${DS_TEXT.primary} font-medium text-center`}>
                        {u.department?.name || u.department?.code || "-"}
                      </TableCell>
                      <TableCell className={`${DS_TEXT.secondary} text-center`}>
                        {u.gender === "M" ? "Male" : "Female"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={u.is_attend ? "success" : "danger"}>
                          {u.is_attend ? "Attended" : "Not Yet"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-center sticky right-0 z-10 min-w-[140px] transition-colors ${
                          isSelected ? DS_BG.app : `${DS_BG.surface} group-${DS_BG.appHover}`
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDetailUser(u)}
                            title="View User Details"
                            className="h-8 w-8 p-1.5"
                          >
                            <Eye className={`w-5 h-5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} transition-colors`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit User"
                            className="h-8 w-8 p-1.5"
                          >
                            <Edit className={`w-5 h-5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} transition-colors`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteTarget(u)}
                            title="Delete User"
                            className={`h-8 w-8 p-1.5 ${DS_TEXT.primaryHover}`}
                          >
                            <Trash2 className={`w-5 h-5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} transition-colors`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className={`flex items-center justify-between px-1 py-1 text-xs ${DS_TEXT.secondary} lg:hidden`}>
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${DS_TEXT.primary} select-none`}>
              <input
                type="checkbox"
                aria-label="Select all users"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isPartiallySelected;
                }}
                onChange={handleSelectAll}
                className={`h-4 w-4 rounded ${DS_BORDER.strong} ${DS_TEXT.primary} ${DS_FOCUS.checkbox} cursor-pointer`}
              />
              <span>Select all ({users.length})</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {users.map((u) => {
              const isSelected = selectedUserIds.includes(u.id);
              return (
                <Card
                  key={u.id}
                  className={`p-5 shadow-xs ${DS_BORDER.default} space-y-3 transition-colors ${
                    isSelected ? `${DS_BG.app} ${DS_BORDER.medium}` : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${u.name}`}
                        checked={isSelected}
                        onChange={() => handleToggleSelect(u.id)}
                        className={`h-4 w-4 rounded ${DS_BORDER.strong} ${DS_TEXT.primary} ${DS_FOCUS.checkbox} cursor-pointer`}
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${DS_TEXT.primary}`}>{u.name}</h4>
                        <p className={`text-xs ${DS_TEXT.secondary} tabular-nums`}>NIP: {u.nip}</p>
                      </div>
                    </div>
                    <Badge variant={u.isHR ? "warning" : "info"}>
                      {u.isHR ? "HR" : "Employee"}
                    </Badge>
                  </div>

                  <div className={`text-xs space-y-1 ${DS_BG.app} p-2.5 rounded-lg border ${DS_BORDER.subtle}`}>
                    <div className={`flex items-center justify-between ${DS_TEXT.primary}`}>
                      <span className={DS_TEXT.secondary}>Department:</span>
                      <span className="font-semibold">{u.department?.name || u.department?.code}</span>
                    </div>
                    <div className={`flex items-center justify-between ${DS_TEXT.primary}`}>
                      <span className={DS_TEXT.secondary}>Gender:</span>
                      <span>{u.gender === "M" ? "Male" : "Female"}</span>
                    </div>
                    <div className={`flex items-center justify-between ${DS_TEXT.primary}`}>
                      <span className={DS_TEXT.secondary}>Today Attendance:</span>
                      <Badge variant={u.is_attend ? "success" : "danger"}>
                        {u.is_attend ? "Attended" : "Not Yet"}
                      </Badge>
                    </div>
                  </div>

                  <div className={`flex items-center justify-end gap-1.5 pt-2 ${DS_BORDER.subtle}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetailUser(u)}
                      className="text-xs h-8 px-3"
                    >
                      <Eye className={`w-4 h-4 mr-1 ${DS_TEXT.secondary}`} />
                      Detail
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenEdit(u)}
                      className="text-xs h-8 px-3"
                    >
                      <Edit className={`w-4 h-4 mr-1 ${DS_TEXT.secondary}`} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget(u)}
                      className={`text-xs h-8 px-3 ${DS_TEXT.inverse}`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {detailUser && (
        <Modal
          isOpen={!!detailUser}
          onClose={() => setDetailUser(null)}
          title="User Details"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className={`p-4 ${DS_BG.app} rounded-xl border ${DS_BORDER.default}`}>
              <h3 className={`text-base font-bold ${DS_TEXT.primary}`}>{detailUser.name}</h3>
              <p className={`text-xs ${DS_TEXT.secondary} tabular-nums`}>NIP: {detailUser.nip}</p>
              <div className="mt-2">
                <Badge variant={detailUser.isHR ? "warning" : "info"}>
                  {detailUser.isHR ? "HR" : "Employee"}
                </Badge>
              </div>
            </div>

            <div className={`space-y-2 p-4 ${DS_BG.surface} rounded-xl border ${DS_BORDER.default}`}>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Department:</span>
                <span className={`font-semibold ${DS_TEXT.primary}`}>{detailUser.department?.name || detailUser.department?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Gender:</span>
                <span className={DS_TEXT.primary}>{detailUser.gender === "M" ? "Male" : "Female"}</span>
              </div>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Today Attendance:</span>
                <Badge variant={detailUser.is_attend ? "success" : "danger"}>
                  {detailUser.is_attend ? "Attended" : "Not Yet"}
                </Badge>
              </div>
              {detailUser.createdAt && (
                <div className={`flex justify-between border-t ${DS_BORDER.subtle} pt-2`}>
                  <span className={DS_TEXT.secondary}>Registered Date:</span>
                  <span className={`${DS_TEXT.primary} tabular-nums`}>{formatDate(detailUser.createdAt)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setDetailUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirm Delete User"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className={`flex items-start gap-3 p-5 ${DS_BG.muted} border ${DS_BORDER.strong} rounded-xl ${DS_TEXT.primary}`}>
              <AlertTriangle className={`w-5 h-5 ${DS_TEXT.primary} shrink-0 mt-0.5`} />
              <div>
                <p className={`font-bold ${DS_TEXT.primary}`}>Are you sure?</p>
                <p className={`${DS_TEXT.secondary} mt-0.5`}>
                  User <strong className={DS_TEXT.primary}>{deleteTarget.name}</strong> (NIP: {deleteTarget.nip}) will be removed from the system.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDelete}
                isLoading={isProcessing}
                className={DS_TEXT.inverse}
              >
                Delete User
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isBulkDeleteModalOpen && (
        <Modal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          title="Confirm Bulk Deletion"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className={`flex items-start gap-3 p-5 ${DS_BG.muted} border ${DS_BORDER.strong} rounded-xl ${DS_TEXT.primary}`}>
              <AlertTriangle className={`w-5 h-5 ${DS_TEXT.primary} shrink-0 mt-0.5`} />
              <div>
                <p className={`font-bold ${DS_TEXT.primary}`}>Are you sure?</p>
                <p className={`${DS_TEXT.secondary} mt-0.5`}>
                  You are about to delete <strong className={DS_TEXT.primary}>{selectedUserIds.length}</strong> selected user{selectedUserIds.length > 1 ? "s" : ""}. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleBulkDelete}
                isLoading={isProcessing}
                className={DS_TEXT.inverse}
              >
                Delete {selectedUserIds.length} User{selectedUserIds.length > 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? "Edit User" : "Add New User"}
          maxWidth="md"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Budi Santoso"
                  error={formErrors.name}
                  required
                />
              </div>

              <SelectField
                label="Gender"
                value={formGender}
                onValueChange={(val) => setFormGender(val as "M" | "F")}
                options={GENDER_OPTIONS}
                required
              />

              <SelectField
                label="Department"
                value={formDept}
                onValueChange={handleDepartmentChange}
                options={departments.map((dept) => ({
                  value: dept.code,
                  label: `${dept.name} (${dept.code})`,
                }))}
                required
              />

              <div className="sm:col-span-2">
                <SelectField
                  label="Role"
                  value={formIsHR ? "HR" : "EMPLOYEE"}
                  onValueChange={(val) => setFormIsHR(val === "HR")}
                  disabled={true}
                  options={getRoleFormOptions(formDept === "HR")}
                  helperText={
                    formDept === "HR"
                      ? "Assigned HR role automatically for HR department"
                      : "Only members of HR department can have the HR role"
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label={editingUser ? "New Password (Optional)" : "Password"}
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? "Leave empty to keep current password" : "birth date (010196)"}
                  error={formErrors.password}
                  required={!editingUser}
                />
              </div>
            </div>

            <div className={`flex justify-end gap-2 pt-3 ${DS_BORDER.default}`}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isProcessing}
                className={DS_TEXT.inverse}
              >
                {editingUser ? "Save Changes" : "Create User"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
