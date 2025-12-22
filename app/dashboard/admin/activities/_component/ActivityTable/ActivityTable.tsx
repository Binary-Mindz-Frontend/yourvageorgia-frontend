/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { SquarePen, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import { toast } from "sonner";

import { IActivity } from "@/types/activity.types";
import { createActivity, deleteActivity, getActivities, updateActivity } from "@/services/activity/activity";

type TActivityRow = IActivity & { _index: number };

const ActivityPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [activities, setActivities] = useState<IActivity[]>([]);
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
  useEffect(() => {
    fetchActivities();
  }, []);

  // Fetch all activities
  const fetchActivities = async () => {
    setTableLoading(true);
    try {
      const result = await getActivities();
      
      if ("error" in result) {
        toast.error(result.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        setActivities([]);
      } else {
        setActivities(result.data);
      }
    } catch (error) {
      toast.error("Failed to fetch activities", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      setActivities([]);
    } finally {
      setTableLoading(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentActivities: TActivityRow[] = activities
    .slice(indexOfFirstItem, indexOfLastItem)
    .map((item, index) => ({
      ...item,
      _index: indexOfFirstItem + index + 1,
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
      toast.error("Please enter activity title", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      return;
    }

    setLoading(true);
    try {
      const result = await createActivity({
        title: inputValue.trim(),
      });

      if ("error" in result) {
        toast.error(result.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      } else {
        toast.success("Activity created successfully!", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        setInputValue("");
        setOpenAdd(false);
        // Refresh the activities list
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to create activity", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!selectedActivity || inputValue.trim() === "") {
      toast.error("Please enter activity title", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      return;
    }

    setLoading(true);
    try {
      const result = await updateActivity(selectedActivity._id!, {
        title: inputValue.trim(),
      });

      if ("error" in result) {
        toast.error(result.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      } else {
        toast.success("Activity updated successfully!", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        setSelectedActivity(null);
        setInputValue("");
        setOpenEdit(false);
        // Refresh the activities list
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to update activity", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
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
        toast.error(result.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
      } else {
        toast.success("Activity deleted successfully!", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        setSelectedActivity(null);
        setOpenDelete(false);
        // Refresh the activities list
        await fetchActivities();
      }
    } catch (error) {
      toast.error("Failed to delete activity", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
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
        totalItems={activities.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Add Activity Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-[#1a1a1a] text-white">
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter activity title"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-4"
            disabled={loading}
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button 
              className="cursor-pointer bg-black text-white hover:bg-black hover:text-white" 
              variant="outline" 
              onClick={() => setOpenAdd(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-md cursor-pointer bg-white text-black" 
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-[#1a1a1a] text-white">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Edit activity title"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-4"
            disabled={loading}
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button 
              className="cursor-pointer bg-white text-black hover:bg-white hover:text-black" 
              variant="outline" 
              onClick={() => setOpenEdit(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="cursor-pointer rounded-md bg-black" 
              onClick={handleEdit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-[#1a1a1a] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mt-4">Are you sure you want to delete {selectedActivity?.title}?</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenDelete(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityPage;