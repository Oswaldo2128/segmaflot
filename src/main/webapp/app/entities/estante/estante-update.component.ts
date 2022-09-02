import { Component, Vue, Inject } from 'vue-property-decorator';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import AlertService from '@/shared/alert/alert.service';

import NivelService from '@/entities/nivel/nivel.service';
import { INivel } from '@/shared/model/nivel.model';

import { IEstante, Estante } from '@/shared/model/estante.model';
import EstanteService from './estante.service';

const validations: any = {
  estante: {
    nombre: {},
    material: {},
    color: {},
    descripcion: {},
    createByUser: {},
    createdOn: {},
    modifyByUser: {},
    modifiedOn: {},
    auditStatus: {},
  },
};

@Component({
  validations,
})
export default class EstanteUpdate extends Vue {
  @Inject('estanteService') private estanteService: () => EstanteService;
  @Inject('alertService') private alertService: () => AlertService;

  public estante: IEstante = new Estante();

  @Inject('nivelService') private nivelService: () => NivelService;

  public nivels: INivel[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.estanteId) {
        vm.retrieveEstante(to.params.estanteId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.estante.id) {
      this.estanteService()
        .update(this.estante)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('segmaflotApp.estante.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.estanteService()
        .create(this.estante)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('segmaflotApp.estante.created', { param: param.id });
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }

  public convertDateTimeFromServer(date: Date): string {
    if (date && dayjs(date).isValid()) {
      return dayjs(date).format(DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.estante[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.estante[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.estante[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.estante[field] = null;
    }
  }

  public retrieveEstante(estanteId): void {
    this.estanteService()
      .find(estanteId)
      .then(res => {
        res.createdOn = new Date(res.createdOn);
        res.modifiedOn = new Date(res.modifiedOn);
        this.estante = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.nivelService()
      .retrieve()
      .then(res => {
        this.nivels = res.data;
      });
  }
}
