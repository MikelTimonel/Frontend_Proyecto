import {Component, OnInit} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';
import { GetanalisisService } from './getanalisis.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'belbeau';

  data: any;
  responseService: any;
  constructor(private servicegetanalysis: GetanalisisService, private spinner: NgxSpinnerService)
  {}
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage!: WebcamImage;
 currentColor: string = '';
  // webcam snapshot trigger
  maquilladaimage: any;
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    
    this.getAnalysis()
    
  }
  changeColor(color: string){
    this.getAnalysis(color);
  }
  async getAnalysis(color?: any) {
    this.spinner.show();
    
    // Establecer el color actual
    this.currentColor = color === 'pink' ? '#A83C4A' : color === 'purple' ? '#701F55' : !color ? '#A83C4A' : '#EFEAE2';
    
    // Obtener la imagen en base64 sin la parte de la cabecera
    const resultadobase64 = this.webcamImage.imageAsDataUrl.substring(this.webcamImage.imageAsDataUrl.indexOf(",") + 1).trim();

    // Preparar los datos a enviar
    this.data = {
        img: resultadobase64,
        color: color || "pink",
    };

    // Llamar al servicio sin await, simplemente subscribe
    this.servicegetanalysis.postData(this.data).subscribe(
        response => {
            console.log('Respuesta del servidor:', response);
            this.responseService = response;
            this.maquilladaimage = 'data:image/jpeg;base64,' + response.makeup_image;

            // Asegúrate de ocultar el spinner después de recibir la respuesta
            this.spinner.hide();
        },
        error => {
            console.error('Error al realizar la solicitud:', error);
            this.spinner.hide(); // Es importante ocultar el spinner incluso si hay error
        }
    );
}



  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}
