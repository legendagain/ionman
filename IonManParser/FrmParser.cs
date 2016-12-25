using Aspose.Cells;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace IonManParser
{
    public partial class FrmParser : Form
    {
        public FrmParser()
        {
            InitializeComponent();
        }

        private void btnChooseFile_Click(object sender, EventArgs e)
        {
            var dlg = new OpenFileDialog();
            if (dlg.ShowDialog() != DialogResult.OK)
                return;

            var fileName = dlg.FileName;
            txtFilename.Text = fileName;
        }

        private void btnParse_Click(object sender, EventArgs e)
        {
            try
            {
                var doc = new Workbook(txtFilename.Text);
                var worksheet = doc.Worksheets[0];
                var cells = worksheet.Cells;

                int row = 0;
                int col = 0;
                var headers = new Dictionary<string, int>();
                while (true)
                {
                    var header = cells[row, col].StringValue;
                    if (string.IsNullOrWhiteSpace(header))
                        break;
                    headers.Add(header, col);
                    col++;
                }

                row++;
                col = 0;
                int retryCount = 0;

                var list = new List<QuestionModel>();
                while (retryCount < 3)
                {
                    var model = new QuestionModel();
                    foreach (var header in headers)
                    {
                        var cell = cells[row, header.Value];
                        if (string.IsNullOrWhiteSpace(cell.StringValue))
                        {
                            retryCount++;
                            break;
                        }

                        switch (header.Key)
                        {
                            case "Question":
                                model.Question = cell.StringValue;
                                break;
                            case "Answer":
                                model.Answer = cell.StringValue;
                                break;
                            case "Difficulty":
                                model.Difficulty = cell.StringValue;
                                break;
                            case "Level":
                                model.Level = cell.IntValue;
                                break;
                            case "Type":
                                model.Type = cell.StringValue;
                                break;
                        }

                        if (header.Key == headers.Last().Key)
                            retryCount = 0;
                    }

                    if (retryCount == 0)
                        list.Add(model);
                    row++;
                }

                var json = JsonConvert.SerializeObject(list);
                txtResult.Text = json;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.StackTrace);
            }
        }
    }
}

class QuestionModel
{
    public string Question { get; set; }
    public string Answer { get; set; }
    public string Difficulty { get; set; }
    public int Level { get; set; }
    public string Type { get; set; }
}
