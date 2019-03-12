## Core services

Services should not be imported to the Core module, instead of it `@Injectable` annotation should be provided in the final service class.

```
@Injectable({
    providedIn: 'root'
})
...
```