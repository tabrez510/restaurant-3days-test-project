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
import { RecipeFormSchema, recipeSchema } from "@/schema/recipeSchema";
import { useRecipeStore } from "@/store/useRecipeStore";
import { RecipeItem } from "@/types/restaurantType";
import { Loader2 } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const EditRecipe = ({
  selectedRecipe,
  editOpen,
  setEditOpen,
}: {
  selectedRecipe: RecipeItem;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState<RecipeFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
    ingredients: [{ name: "", quantity: "" }],
  });
  const [error, setError] = useState<Partial<RecipeFormSchema>>({});
  const { loading, editRecipe } = useRecipeStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const ingredientChangeHandler = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedIngredients = [...input.ingredients];
    updatedIngredients[index][
      e.target.name as keyof (typeof input.ingredients)[0]
    ] = e.target.value;
    setInput({ ...input, ingredients: updatedIngredients });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = recipeSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<RecipeFormSchema>);
      return;
    }

    // API call
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      formData.append("ingredients", JSON.stringify(input.ingredients));
      if (input.image) {
        formData.append("image", input.image);
      }
      await editRecipe(selectedRecipe._id, formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInput({
      name: selectedRecipe?.name || "",
      description: selectedRecipe?.description || "",
      price: selectedRecipe?.price || 0,
      image: undefined,
      ingredients: selectedRecipe?.ingredients || [{ name: "", quantity: "" }],
    });
  }, [selectedRecipe]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
          <DialogDescription>
            Update your recipe details and ingredients!
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
            {error && (
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
            {error && (
              <span className="text-xs font-medium text-red-600">
                {error.description}
              </span>
            )}
          </div>
          <div>
            <Label>Price (Rupees)</Label>
            <Input
              type="number"
              name="price"
              value={input.price}
              onChange={changeEventHandler}
              placeholder="Enter recipe price"
            />
            {error && (
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
                setInput({ ...input, image: e.target.files?.[0] || undefined })
              }
            />
            {error && (
              <span className="text-xs font-medium text-red-600">
                {error.image?.name}
              </span>
            )}
          </div>
          {input.ingredients.map((ingredient, index) => (
            <div key={index}>
              <Label>Ingredient {index + 1}</Label>
              <Input
                type="text"
                name="name"
                value={ingredient.name}
                onChange={(e) => ingredientChangeHandler(index, e)}
                placeholder="Enter ingredient name"
              />
              <Input
                type="text"
                name="quantity"
                value={ingredient.quantity}
                onChange={(e) => ingredientChangeHandler(index, e)}
                placeholder="Enter ingredient quantity"
              />
            </div>
          ))}
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

export default EditRecipe;
