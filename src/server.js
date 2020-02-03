// criada uma nova instância da class app
// Foi efetuada aqui a separação, por que quando for executados os teste unitários não é preciso saber em qual porta o server está sendo usado
import app from './app';

app.listen(3333);
