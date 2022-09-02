import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IEmpleadoTipoVehiculo } from '@/shared/model/empleado-tipo-vehiculo.model';

import EmpleadoTipoVehiculoService from './empleado-tipo-vehiculo.service';
import AlertService from '@/shared/alert/alert.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class EmpleadoTipoVehiculo extends Vue {
  @Inject('empleadoTipoVehiculoService') private empleadoTipoVehiculoService: () => EmpleadoTipoVehiculoService;
  @Inject('alertService') private alertService: () => AlertService;

  private removeId: number = null;

  public empleadoTipoVehiculos: IEmpleadoTipoVehiculo[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllEmpleadoTipoVehiculos();
  }

  public clear(): void {
    this.retrieveAllEmpleadoTipoVehiculos();
  }

  public retrieveAllEmpleadoTipoVehiculos(): void {
    this.isFetching = true;
    this.empleadoTipoVehiculoService()
      .retrieve()
      .then(
        res => {
          this.empleadoTipoVehiculos = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IEmpleadoTipoVehiculo): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeEmpleadoTipoVehiculo(): void {
    this.empleadoTipoVehiculoService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('segmaflotApp.empleadoTipoVehiculo.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllEmpleadoTipoVehiculos();
        this.closeDialog();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
