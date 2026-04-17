// src/features/auth/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { 
  Button, 
  Input, 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../../../desingSystem/primitives";

import { useAuth } from "../../../context/AuthContext";
import styles from "./auth.module.css";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(1, { message: "Contraseña requerida" }),
});

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const location = useLocation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      email: "", 
      password: "" 
    },
  });

  // Si viene del registro, pre-llenar el email
  useEffect(() => {
    if (location.state?.email) {
      form.setValue("email", location.state.email);
    }
  }, [location.state, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('🔵 Iniciando login con:', values.email);
      await login(values.email, values.password);
      console.log('✅ Login exitoso, AuthContext debe redirigir');
    } catch (error) {
      console.error('❌ Error en login:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.loginContainer}>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="usuario@pae.edu" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Contraseña</FormLabel>
                <a href="#" className={styles.forgotPasswordLink}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <FormControl>
                <Input type="password" placeholder="******" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>
    </Form>
  );
}