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
import { Loader2, Plus } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditRecipe from "./EditMenu";
import { RecipeFormSchema, recipeSchema } from "@/schema/recipeSchema";
import { useRecipeStore } from "@/store/useRecipeStore";
import { useCategoryStore } from "@/store/useCategoryStore";

const AddRecipe = () => {
  const [input, setInput] = useState<RecipeFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
    ingredients: [{ name: "", quantity: "" }],
    categoryId: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>();
  const [error, setError] = useState<Partial<RecipeFormSchema>>({});
  const { loading, createRecipe } = useRecipeStore();
  const { categories, fetchCategories } = useCategoryStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({ ...input, categoryId: e.target.value });
  };

  // Handle ingredient changes
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients = [...input.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setInput({ ...input, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setInput({
      ...input,
      ingredients: [...input.ingredients, { name: "", quantity: "" }],
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = recipeSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<RecipeFormSchema>);
      return;
    }

    // API request starts here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      formData.append("ingredients", JSON.stringify(input.ingredients));
      formData.append("categoryId", input.categoryId);
      console.log(formData);
      await createRecipe(formData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Recipes
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-orange hover:bg-hoverOrange">
              <Plus className="mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Recipe</DialogTitle>
              <DialogDescription>
                Create a recipe that will make your restaurant stand out.
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
                  placeholder="Enter recipe name"
                />
                {error?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter recipe description"
                />
                {error?.description && (
                  <span className="text-xs font-medium text-red-600">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <Label>Price in (Rupees)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter recipe price"
                />
                {error?.price && (
                  <span className="text-xs font-medium text-red-600">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label>Upload Recipe Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error?.image?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.image.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Category</Label>
                <select
                  name="categoryId"
                  value={input.categoryId}
                  onChange={handleCategoryChange}
                  className="block w-full p-2 mt-1 border rounded-md"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {error?.categoryId && (
                  <span className="text-xs font-medium text-red-600">
                    {error.categoryId}
                  </span>
                )}
              </div>
              <div>
                <Label>Ingredients</Label>
                {input.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(index, "name", e.target.value)
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Quantity (e.g., 200g, 2 cups)"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <Button type="button" onClick={addIngredient} className="mt-2">
                  Add Ingredient
                </Button>
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
      {categories?.recipes?.map((recipe: any, idx: number) => (
        <div key={idx} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {recipe.name}
              </h1>
              <p className="text-sm tex-gray-600 mt-1">{recipe.description}</p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#a36500]">₹{recipe.price}</span>
              </h2>
            </div>
            <Button
              onClick={() => {
                setSelectedRecipe(recipe);
                setEditOpen(true);
              }}
              className="bg-orange hover:bg-hoverOrange h-fit"
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
      <EditRecipe
        open={editOpen}
        setOpen={setEditOpen}
        selectedRecipe={selectedRecipe}
      />
    </div>
  );
};

export default AddRecipe;
