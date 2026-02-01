import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptor])
    )]
}).catch((err) => console.error(err));


function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn){
    const req = request.clone({
        headers: request.headers.set('X-DEBUG', 'TEST')
    });
    console.log('Outgoing request');
    console.log(request);
    // return next(req);
    return next(request).pipe(
        tap({
            next: (event:any) => {
                if(event.type === HttpEventType.Response){
                    console.log('incoming respone');
                    console.log(event.status);
                }
            }
        })
    );
}
