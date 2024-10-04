import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useCategoryStore } from "./useCategoryStore";

const API_END_POINT = "http://localhost:8000/api/v1/recipe";
axios.defaults.withCredentials = true;

type RecipeState = {
  loading: boolean;
  createRecipe: (formData: FormData) => Promise<void>;
  editRecipe: (id: string, formData: FormData) => Promise<void>;
  deleteRecipe: (id: string, categoryId: string) => Promise<void>;
};

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      loading: false,

      // Create a new recipe
      createRecipe: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success("Recipe added successfully");
            set({ loading: false });
            // Fetch updated categories
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to add recipe");
          set({ loading: false });
        }
      },

      // Edit an existing recipe
      editRecipe: async (id: string, formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success("Recipe updated successfully");
            set({ loading: false });
            // Fetch updated categories
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to update recipe"
          );
          set({ loading: false });
        }
      },

      // Delete a recipe
      deleteRecipe: async (id: string, categoryId: string) => {
        try {
          set({ loading: true });
          const response = await axios.delete(`${API_END_POINT}/${id}`, {
            data: { categoryId },
          });
          if (response.data.success) {
            toast.success("Recipe deleted successfully");
            set({ loading: false });
            // Fetch updated categories
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error("Failed to delete recipe");
          set({ loading: false });
        }
      },
    }),
    {
      name: "recipe-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
