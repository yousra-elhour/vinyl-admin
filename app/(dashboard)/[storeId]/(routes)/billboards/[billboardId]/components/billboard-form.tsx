"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { BillBoard, Product } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BillBoardFormProps {
  initialData: BillBoard | null;
  products: Product[];
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  color: z.string().min(4),
  productId: z.string().min(1),
  cover: z.string().min(1),
  description: z.string().min(1),
});

type BillBoardFormValues = z.infer<typeof formSchema>;

const BillBoardForm: React.FC<BillBoardFormProps> = ({
  initialData,
  products,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillBoardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
      color: "#ffff",
      productId: "",
      cover: "",
      description: "",
    },
  });

  useEffect(() => {
    setSelectedColor(form.getValues("color"));
  }, [form]);

  const onSubmit = async (data: BillBoardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vinyl Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <>
                      <div className="flex items-center gap-x-4">
                        <Input
                          disabled={loading}
                          placeholder="#FFFFF"
                          onClick={() => setIsColorPickerVisible(true)}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedColor(e.target.value); // Update selectedColor with the input value
                          }}
                        />
                        <div
                          className="border p-4 rounded-full color-preview"
                          style={{ backgroundColor: selectedColor }}
                          onClick={() => setIsColorPickerVisible(true)}
                        />
                      </div>
                      {isColorPickerVisible && (
                        <div className="color-picker-popover">
                          <div
                            className="color-picker-cover"
                            onClick={() => setIsColorPickerVisible(false)}
                          />
                          <SketchPicker
                            color={selectedColor}
                            onChange={(color) => {
                              setSelectedColor(color.hex); // Update selectedColor when the color changes
                              field.onChange({ target: { value: color.hex } }); // Update the form field value
                            }}
                          />
                        </div>
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => {
                        // Find the selected product based on its ID
                        const selectedProduct = products.find(
                          (product) => product.id === value
                        );

                        // Update the hidden fields with product.cover and product.description
                        form.setValue("cover", selectedProduct?.imageUrl || "");
                        form.setValue(
                          "description",
                          selectedProduct?.description || ""
                        );

                        // Update the productId field
                        field.onChange(value);
                      }}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select Product"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.album}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input disabled={loading} hidden {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {/* You can optionally display the description value here */}
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} hidden {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillBoardForm;
