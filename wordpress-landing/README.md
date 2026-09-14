# Landing de UTN BA Motorsport para WordPress

Esta versión reemplaza solamente el contenido de la página “Formula E Student”. Conserva el encabezado, navegación y pie institucionales del WordPress de UTN FRBA.

## Instalación recomendada

1. Hacer una copia o revisión de la página actual.
2. Vaciar el contenido del editor, sin borrar la página ni cambiar su URL.
3. Agregar un bloque **HTML personalizado** y pegar el contenido de `formula-e-student.html`.
4. Copiar `formula-e-student.css` en **Apariencia → Personalizar → CSS adicional**.
5. Publicar primero como vista previa y comprobar escritorio y teléfono.

Si el sitio usa un tema hijo, es preferible cargar el CSS como archivo desde `functions.php` en lugar de pegarlo en el personalizador:

```php
add_action('wp_enqueue_scripts', function () {
    if (is_page('formula-e-student')) {
        wp_enqueue_style(
            'utnba-formula-student',
            get_stylesheet_directory_uri() . '/css/formula-e-student.css',
            array(),
            '1.0.0'
        );
    }
});
```

El CSS usa el prefijo `.utnba-` para evitar conflictos con Bootstrap, Elementor y los estilos del tema institucional. No requiere JavaScript ni plugins adicionales.
