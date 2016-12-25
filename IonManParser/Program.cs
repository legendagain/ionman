using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace IonManParser
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            InitLicense();
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new FrmParser());
        }

        private static void InitLicense()
        {
            var license = new Aspose.Cells.License();
            try
            {
                var licFileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"libs\Aspose\Aspose.Total.lic");
                if (File.Exists(licFileName))
                {
                    using (var fileStream = File.OpenRead(licFileName))
                    {
                        license.SetLicense(fileStream);
                    }
                }
            }
            catch { }
        }
    }
}
