import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useState, FormEvent, useEffect } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { categorySchema, CategoryFormSchema } from "@/schema/categorySchema";

const EditCategory = ({
  selectedCategory,
  editOpen,
  setEditOpen,
}: {
  selectedCategory: CategoryItem;
  editOpen: boolean;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState<CategoryFormSchema>({
    name: "",
    image: undefined,
    cuisines: [""],
  });
  const [error, setError] = useState<Partial<CategoryFormSchema>>({});
  const { loading, updateCategory } = useCategoryStore();

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

    await updateCategory(selectedCategory._id, formData);
    setEditOpen(false);
  };

  useEffect(() => {
    setInput({
      name: selectedCategory?.name || "",
      cuisines: selectedCategory?.cuisines || [""],
      image: undefined,
    });
  }, [selectedCategory]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update your category details to keep the menu organized.
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
            {input.cuisines.map((cuisine, index) => (
              <Input
                key={index}
                type="text"
                name="cuisines"
                value={cuisine}
                onChange={(e) => changeEventHandler(e, index)}
                placeholder={`Enter cuisine ${index + 1}`}
              />
            ))}
          </div>
          <div>
            <Label>Upload Category Image</Label>
            <Input
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) =>
                setInput({ ...input, image: e.target.files?.[0] || undefined })
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
              <Button className="bg-orange hover:bg-hoverOrange">Submit</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
