namespace IonManParser
{
    partial class FrmParser
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnChooseFile = new System.Windows.Forms.Button();
            this.txtFilename = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.btnParse = new System.Windows.Forms.Button();
            this.grpResult = new System.Windows.Forms.GroupBox();
            this.txtResult = new System.Windows.Forms.TextBox();
            this.grpResult.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnChooseFile
            // 
            this.btnChooseFile.Location = new System.Drawing.Point(651, 10);
            this.btnChooseFile.Name = "btnChooseFile";
            this.btnChooseFile.Size = new System.Drawing.Size(75, 23);
            this.btnChooseFile.TabIndex = 5;
            this.btnChooseFile.Text = "...";
            this.btnChooseFile.UseVisualStyleBackColor = true;
            this.btnChooseFile.Click += new System.EventHandler(this.btnChooseFile_Click);
            // 
            // txtFilename
            // 
            this.txtFilename.Location = new System.Drawing.Point(68, 12);
            this.txtFilename.Name = "txtFilename";
            this.txtFilename.Size = new System.Drawing.Size(572, 20);
            this.txtFilename.TabIndex = 4;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(52, 13);
            this.label1.TabIndex = 3;
            this.label1.Text = "Filename:";
            // 
            // btnParse
            // 
            this.btnParse.Location = new System.Drawing.Point(333, 38);
            this.btnParse.Name = "btnParse";
            this.btnParse.Size = new System.Drawing.Size(75, 23);
            this.btnParse.TabIndex = 6;
            this.btnParse.Text = "Parse!";
            this.btnParse.UseVisualStyleBackColor = true;
            this.btnParse.Click += new System.EventHandler(this.btnParse_Click);
            // 
            // grpResult
            // 
            this.grpResult.Controls.Add(this.txtResult);
            this.grpResult.Location = new System.Drawing.Point(12, 73);
            this.grpResult.Name = "grpResult";
            this.grpResult.Size = new System.Drawing.Size(714, 329);
            this.grpResult.TabIndex = 7;
            this.grpResult.TabStop = false;
            this.grpResult.Text = "Generated JSON";
            // 
            // txtResult
            // 
            this.txtResult.Location = new System.Drawing.Point(6, 19);
            this.txtResult.Multiline = true;
            this.txtResult.Name = "txtResult";
            this.txtResult.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtResult.Size = new System.Drawing.Size(702, 304);
            this.txtResult.TabIndex = 0;
            // 
            // FrmParser
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(736, 414);
            this.Controls.Add(this.grpResult);
            this.Controls.Add(this.btnParse);
            this.Controls.Add(this.btnChooseFile);
            this.Controls.Add(this.txtFilename);
            this.Controls.Add(this.label1);
            this.Name = "FrmParser";
            this.Text = "Parser";
            this.grpResult.ResumeLayout(false);
            this.grpResult.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnChooseFile;
        private System.Windows.Forms.TextBox txtFilename;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnParse;
        private System.Windows.Forms.GroupBox grpResult;
        private System.Windows.Forms.TextBox txtResult;
    }
}

