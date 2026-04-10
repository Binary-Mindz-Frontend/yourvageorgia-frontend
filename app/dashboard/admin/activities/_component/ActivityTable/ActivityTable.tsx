
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { createActivity, deleteActivity, getActivities, updateActivity } from "@/services/activity/activity";
import { IActivity } from "@/types/activity.types";
import ActivityDialog from "../ActivityDialog/ActivityDialog";

type TActivityRow = IActivity & { _index: number };

const ActivityPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Form state
  const [inputValue, setInputValue] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  // Fetch activities on component mount
  const fetchActivities = useCallback(async () => {
    setTableLoading(true);
    try {
      const result = await getActivities(currentPage, pageSize);

      if ("error" in result) {
        toast.error(result.error);
        setActivities([]);
        setTotalActivities(0);
      } else {
        setActivities(result.data);
        setTotalActivities(result.meta.total);
      }
    } catch (error) {
      toast.error("Failed to fetch activities");
      setActivities([]);
      setTotalActivities(0);
    } finally {
      setTableLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Pagination
  const currentActivities: TActivityRow[] = activities.map((item, index) => ({
    ...item,
    _index: (currentPage - 1) * pageSize + index + 1,
  }));

  // Table columns
  const activityColumn: Column<TActivityRow>[] = [
    {
      header: "#",
      cell: (row) => <span className="text-white">{row._index}</span>,
    },
    {
      header: "Activity Title",
      accessor: "title",
      cell: (row) => <span className="text-white">{row.title}</span>,
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center gap-3">
          <button
            className="cursor-pointer transition"
            onClick={() => {
              setSelectedActivity(row);
              setInputValue(row.title);
              setOpenEdit(true);
            }}
          >
            <SquarePen size={18} />
          </button>

          <button
            className="cursor-pointer text-red-400"
            onClick={() => {
              setSelectedActivity(row);
              setOpenDelete(true);
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Handle Add
  const handleAdd = async () => {
    if (inputValue.trim() === "") {
      toast.error("Please enter activity title");
      return;
    }

    setLoading(true);
    try {
      const result = await createActivity({
        title: inputValue.trim(),
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Activity created successfully");
        setInputValue("");
        setOpenAdd(false);
        setCurrentPage(1);
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!selectedActivity || inputValue.trim() === "") {
      toast.error("Please enter activity title");
      return;
    }

    setLoading(true);
    try {
      const result = await updateActivity(selectedActivity._id!, {
        title: inputValue.trim(),
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Activity updated successfully");
        setSelectedActivity(null);
        setInputValue("");
        setOpenEdit(false);
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to update activity");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedActivity) return;

    setLoading(true);
    try {
      const result = await deleteActivity(selectedActivity._id!);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Activity deleted successfully");
        setSelectedActivity(null);
        setOpenDelete(false);
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to delete activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-base py-2 sm:py-5 text-white">Activity Management</h1>

        <div className="flex justify-end mb-4 items-center w-full flex-wrap gap-5">
          <Button
            className="cursor-pointer flex items-center bg-[#1a1a1a] hover:bg-[#1a1a1a] px-4 py-2"
            onClick={() => {
              setInputValue("");
              setOpenAdd(true);
            }}
          >
            <Plus size={18} className="mr-2 text-white" />
            <span className="text-white text-base">Add Activity</span>
          </Button>
        </div>

        <p className="text-base py-1">Activity Details</p>
      </header>

      <CustomTable columns={activityColumn} data={currentActivities} loading={tableLoading} />

      <CustomPagination
        totalItems={totalActivities}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Activity Dialogs */}
      <ActivityDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        mode="add"
        inputValue={inputValue}
        onInputChange={setInputValue}
        onConfirm={handleAdd}
        loading={loading}
      />

      <ActivityDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        mode="edit"
        inputValue={inputValue}
        onInputChange={setInputValue}
        onConfirm={handleEdit}
        loading={loading}
      />

      <ActivityDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        mode="delete"
        inputValue=""
        onInputChange={() => { }}
        onConfirm={handleDelete}
        loading={loading}
        activityTitle={selectedActivity?.title}
      />
    </div>
  );
};

export default ActivityPage;