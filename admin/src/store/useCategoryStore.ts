import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/category";
axios.defaults.withCredentials = true;

type categories = {
  _id: string;
  name: string;
  image: string;
  cuisines: string[];
  recipes: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type CategoryState = {
  loading: boolean;
  categories: categories[];
  singleCategory: categories | null;
  fetchCategories: () => Promise<void>;
  fetchSingleCategory: (id: string) => Promise<void>;
  searchCategory: (
    searchText: string,
    selectedCuisines: string[]
  ) => Promise<void>;
  createCategory: (formData: FormData) => Promise<void>;
  updateCategory: (id: string, formData: FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      loading: false,
      categories: [],
      singleCategory: null,

      // Fetch all categories
      fetchCategories: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ categories: response.data.categories, loading: false });
          }
        } catch (error: any) {
          toast.error("Failed to fetch categories");
          set({ loading: false });
        }
      },

      // Fetch a single category with associated recipes
      fetchSingleCategory: async (id: string) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/${id}`);
          if (response.data.success) {
            set({ singleCategory: response.data.category, loading: false });
          }
        } catch (error: any) {
          toast.error("Failed to fetch category");
          set({ loading: false });
        }
      },

      // Search for categories
      searchCategory: async (
        searchText: string,
        selectedCuisines: string[]
      ) => {
        try {
          set({ loading: true });
          const params = new URLSearchParams();
          if (searchText) params.append("searchText", searchText);
          if (selectedCuisines.length > 0) {
            params.append("selectedCuisines", selectedCuisines.join(","));
          }
          const response = await axios.get(
            `${API_END_POINT}/search?${params.toString()}`
          );
          if (response.data.success) {
            set({ categories: response.data.categories, loading: false });
          }
        } catch (error: any) {
          toast.error("Failed to search categories");
          set({ loading: false });
        }
      },

      // Create a new category
      createCategory: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success("Category added successfully");
            set({ loading: false });
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to add category"
          );
          set({ loading: false });
        }
      },

      // Update a category
      updateCategory: async (id: string, formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success("Category updated successfully");
            set({ loading: false });
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to update category"
          );
          set({ loading: false });
        }
      },

      // Delete a category
      deleteCategory: async (id: string) => {
        try {
          set({ loading: true });
          const response = await axios.delete(`${API_END_POINT}/${id}`);
          if (response.data.success) {
            toast.success("Category deleted successfully");
            set({ loading: false });
            await useCategoryStore.getState().fetchCategories();
          }
        } catch (error: any) {
          toast.error("Failed to delete category");
          set({ loading: false });
        }
      },
    }),
    {
      name: "category-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
