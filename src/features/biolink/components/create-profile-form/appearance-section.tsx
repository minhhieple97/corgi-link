'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UseFormRegister } from 'react-hook-form';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

type AppearanceSectionProps = {
  register: UseFormRegister<CreateBiolinkProfileInput>;
};

type ColorFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<CreateBiolinkProfileInput>;
  fieldName: keyof CreateBiolinkProfileInput;
};

const ColorField = ({ id, label, placeholder, register, fieldName }: ColorFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="flex gap-2">
      <Input
        id={id}
        type="color"
        {...register(fieldName)}
        className="w-16 h-10 p-1 cursor-pointer"
      />
      <Input
        {...register(fieldName)}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  </div>
);

export const AppearanceSection = ({ register }: AppearanceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorField
            id="backgroundColor"
            label="Background Color"
            placeholder="#ffffff"
            register={register}
            fieldName="backgroundColor"
          />
          
          <ColorField
            id="textColor"
            label="Text Color"
            placeholder="#000000"
            register={register}
            fieldName="textColor"
          />
          
          <ColorField
            id="accentColor"
            label="Accent Color"
            placeholder="#3b82f6"
            register={register}
            fieldName="accentColor"
          />
        </div>
      </CardContent>
    </Card>
  );
};
