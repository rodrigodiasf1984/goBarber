import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail'; // importa os jobs
import redisConfig from '../config/redis';

const jobs = [CancellationMail]; // cria um array com todos os jobs importados

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // como não é preciso retornar nada do array usamos o foreach, caso contrário use o ma
    // queue===fila
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handle
      };
    });
  }

  // adiciona novo job na fila para ser processado
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa as filas
  processQueue() {
    jobs.forEach(job => {
      // busca as informações da fila relacionado com o job
      const { bee, handle } = this.queues[job.key];
      // pega a fila e processo o handle= neste caso envia o e-mail de cancelamento
      bee.process(handle);
    });
  }
}

export default new Queue();
