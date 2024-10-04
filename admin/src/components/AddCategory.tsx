import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash, Edit } from "lucide-react";
import React, { useState, FormEvent, useEffect } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { categorySchema, CategoryFormSchema } from "@/schema/categorySchema";
import EditCategory from "./EditCategory";

const AddCategory = () => {
  const [input, setInput] = useState<CategoryFormSchema>({
    name: "",
    image: undefined,
    cuisines: [""],
  });
  const [error, setError] = useState<Partial<CategoryFormSchema>>({});
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const {
    loading,
    createCategory,
    fetchCategories,
    categories,
    deleteCategory,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const changeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "cuisines") {
      const updatedCuisines = [...input.cuisines];
      if (index !== undefined) updatedCuisines[index] = value;
      setInput({ ...input, cuisines: updatedCuisines });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = categorySchema.safeParse(input);
    if (!result.success) {
      setError(
        result.error.formErrors.fieldErrors as Partial<CategoryFormSchema>
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    if (input.image) formData.append("image", input.image);
    input.cuisines.forEach((cuisine) => formData.append("cuisines", cuisine));

    await createCategory(formData);
    setOpen(false);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(categoryId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Categories
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-orange hover:bg-hoverOrange">
              <Plus className="mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your restaurant.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter category name"
                />
                {error?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Cuisines</Label>
                <Input
                  type="text"
                  name="cuisines"
                  value={input.cuisines}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  placeholder="e.g. Momos, Biryani"
                />
              </div>
              <div>
                <Label>Upload Category Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button disabled className="bg-orange hover:bg-hoverOrange">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-hoverOrange">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {categories?.map((category: any, idx: number) => (
        <div key={idx} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
            <img
              src={category.image}
              alt={category.name}
              className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setEditOpen(true);
                }}
              >
                <Edit className="w-5 h-5 text-orange" />
              </button>
              <button onClick={() => handleDelete(category._id)}>
                <Trash className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <EditCategory
        selectedCategory={selectedCategory}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddCategory;
